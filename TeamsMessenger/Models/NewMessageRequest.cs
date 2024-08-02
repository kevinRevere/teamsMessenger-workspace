namespace TeamsMessenger.Models
{
    public class NewMessageRequest
    {
        public string[] UserIds { get; set; }
        public string Message { get; set; }
    }
}
