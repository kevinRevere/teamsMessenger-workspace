using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using TeamsMessenger.Services;
using Microsoft.Identity.Client;
using Microsoft.Kiota.Abstractions.Authentication;
using TeamsMessenger.Models;
using Azure.Identity;

public class TokenProvider : IAccessTokenProvider
{
    private readonly IConfidentialClientApplication _confidentialClientApplication;
    private readonly string[] _scopes;

    public TokenProvider(IConfidentialClientApplication confidentialClientApplication, string[] scopes)
    {
        _confidentialClientApplication = confidentialClientApplication;
        _scopes = scopes;
    }

    public async Task<string> GetAuthorizationTokenAsync(Uri uri, Dictionary<string, object> additionalAuthenticationContext = default,
        CancellationToken cancellationToken = default)
    {
        var authResult = await _confidentialClientApplication.AcquireTokenForClient(_scopes).ExecuteAsync(cancellationToken);
        return authResult.AccessToken;
    }

    public AllowedHostsValidator AllowedHostsValidator { get; } = new AllowedHostsValidator();
}

[ApiController]
[Authorize]
[Route("api/graph")]
public class MessageController : ControllerBase
{
    private readonly string _graphClientId;
    private readonly string _graphClientSecret;
    private readonly string _graphTenantId;
    private readonly string _azureClientId;
    private readonly string _azureClientSecret;
    private readonly string _azureTenantId;

    public MessageController(IConfiguration configuration)
    {
        _azureClientId = configuration.GetSection("AzureAd:ClientId").Value!;
        _azureClientSecret = configuration.GetSection("AzureAd:ClientSecret").Value!;
        _azureTenantId = configuration.GetSection("AzureAd:TenantId").Value!;
        _graphClientId = configuration.GetSection("GraphApi:ClientId").Value!;
        _graphClientSecret = configuration.GetSection("GraphApi:ClientSecret").Value!;
        _graphTenantId = configuration.GetSection("GraphApi:TenantId").Value!;
    }

    /// <summary>
    /// creates and authenticates a graph client, then returns it for future use
    /// </summary>
    /// <returns>graph client</returns>
    private GraphServiceClient GetAppAuthGraphClient()
    {
        string[] scopes = new string[] { "https://graph.microsoft.com/.default" };
        IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
            .Create(_graphClientId)
            .WithClientSecret(_graphClientSecret)
            .WithTenantId(_graphTenantId)
            .Build();

        var tokenProvider = new TokenProvider(confidentialClientApplication, scopes);
        var authenticationProvider = new BaseBearerTokenAuthenticationProvider(tokenProvider);
        GraphServiceClient graphClient = new GraphServiceClient(authenticationProvider);

        return graphClient;
    }

    /// <summary>
    /// creates and authenticates a graph client, then returns it for future use
    /// </summary>
    /// <returns>graph client</returns>
    private GraphServiceClient GetUserAuthGraphClient()
    {
        var scopes = new[] { "https://graph.microsoft.com/.default" };

        // using Azure.Identity;
        var options = new OnBehalfOfCredentialOptions
        {
            AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
        };

        // This is the incoming token to exchange using on-behalf-of flow
        var oboToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        var onBehalfOfCredential = new OnBehalfOfCredential(
            _azureTenantId, _azureClientId, _azureClientSecret, oboToken, options);

        var graphClient = new GraphServiceClient(onBehalfOfCredential, scopes);

        return graphClient;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetChats()
    {
        GraphServiceClient graphClient = GetAppAuthGraphClient();
        var response = await graphClient.Users
            .GetAsync(requestConfiguration =>
            {
                requestConfiguration.Headers.Add("ConsistencyLevel", "eventual");
                //requestConfiguration.QueryParameters.Top = 999;
                requestConfiguration.QueryParameters.Filter = $"startsWith(displayName,'Kevin') or startsWith(displayName,'Luke') or startsWith(displayName,'Caleb') or startsWith(displayName,'Marcelo')";
            });

        if (response == null || response.Value == null)
        {
            return NotFound();
        }
        return Ok(response.Value);
    }

    [HttpPost("send")]
    public async Task<IActionResult> FullSend([FromBody] NewMessageRequest request)
    {
        if (request.UserIds.Length < 2)
        {
            return BadRequest("Must have at least 2 user ids");
        }
        // users cannot create chat that they are not in - check for this

        GraphServiceClient graphClient = GetUserAuthGraphClient();

        // create members
        var members = request.UserIds.Select(userId => new AadUserConversationMember
        {
            OdataType = "#microsoft.graph.aadUserConversationMember",
            Roles = new List<string> { "owner" },
            AdditionalData = new Dictionary<string, object>
            {
                { "user@odata.bind", $"https://graph.microsoft.com/v1.0/users('{userId}')" }
            }
        } as ConversationMember).ToList();

        // create chat
        var chatType = request.UserIds.Length > 2 ? ChatType.Group : ChatType.OneOnOne;
        var requestBody = new Chat
        {
            ChatType = chatType,
            Members = members,
        };
        var newChatResponse = await graphClient.Chats.PostAsync(requestBody);
        if (newChatResponse == null)
        {
            return NotFound();
        }
        var chatId = newChatResponse.Id;

        // send message        
        var newChatMessage = new ChatMessage
        {
            Body = new ItemBody
            {
                ContentType = BodyType.Text,
                Content = request.Message
            },
        };

        var newMessageResponse = await graphClient.Chats[chatId].Messages.PostAsync(newChatMessage);
        return Ok(newMessageResponse);
    }
}