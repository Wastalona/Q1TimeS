using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Q1TimeS.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Q1TimeS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TockenController : Controller
    {
        [HttpGet("GetTocken")]
        public string GetTocken()
        {
            List<Claim> claims = new List<Claim>();
            // Stored information
            claims.Add(new Claim(ClaimTypes.Name, "admin"));
            claims.Add(new Claim("level", "5"));
            claims.Add(new Claim(ClaimTypes.Role, "Admin"));

            // Token filling
            var signinKey = JWTSettings.GetSymmetricSecurityKey();
            var jwt = new JwtSecurityToken(
                issuer: JWTSettings.ISSUER,
                audience: JWTSettings.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromHours(8)),
                notBefore: DateTime.UtcNow,
                signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }
    }
}
