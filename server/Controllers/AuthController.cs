using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(JwtOptions jwtOptions, AppDbContext dbContext) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto formData) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == formData.Email);
            if (existingUser != null) return Conflict("An error Occured");

            User user = new User {
                Name = formData.FullName,
                Email = formData.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(formData.Password),
                CreatedAt = DateTime.UtcNow,
            };

            await dbContext.Users.AddAsync(user);
            dbContext.SaveChanges();

            return Ok("Created Successfully");
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto loginUser) {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginUser.Password, user.PasswordHash))
                return BadRequest("Invalid Email or Password");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey));

            var tokenDiscriptor = new SecurityTokenDescriptor {
                Issuer = jwtOptions.Issuer,
                Audience = jwtOptions.Audience,
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Email, loginUser.Email),
                    new Claim("TokenId", Guid.NewGuid().ToString()),
                    new Claim("UserId", user.UserId.ToString()),
                }),
                Expires = DateTime.UtcNow.AddMinutes(jwtOptions.DurationInMin),
            };

            var securityToken = tokenHandler.CreateToken(tokenDiscriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);
            return Ok(accessToken);
        }
    }
}
