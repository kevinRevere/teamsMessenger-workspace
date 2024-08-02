using TeamsMessenger.Models;
using System.Security.Claims;

namespace TeamsMessenger.Services
{
    public class UserService
    {
        public UserService()
        {
        }

        public AppUser GetUser(ClaimsPrincipal claims)
        {
            if (claims == null || claims.Claims.Count() < 1)
            {
                throw new ArgumentNullException(nameof(claims));
            }

            AppUser user = new();

            var id = claims.Claims.FirstOrDefault(m => m.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
            var firstname = claims.Claims.FirstOrDefault(m => m.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname");
            var lastname = claims.Claims.FirstOrDefault(m => m.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname");
            var email = claims.Claims.FirstOrDefault(m => m.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name");

            if (id != null)
                user.Id = id.Value;
            if (firstname != null)
                user.FirstName = firstname.Value;
            if (lastname != null)
                user.LastName = lastname.Value;
            if (email != null)
                user.Email = email.Value;
            return user;
        }
    }
}
