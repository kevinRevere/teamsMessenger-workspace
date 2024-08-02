using TeamsMessenger.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TeamsMessenger.Controllers
{
    [Authorize]
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        // GetUser() -> returns the user's info
        [HttpGet]
        public IActionResult GetUser()
        {
            var user = _userService.GetUser(User);
            if (user == null)
                return NotFound();
            return Ok(user);
        }
    }
}
