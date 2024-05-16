using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace Q1TimeS.Models
{
    public class JWTSettings
    {
        private const string SecretKey = "8#jNiEf?jtCegU_BqELieUWfL*Nq8k6W";
        public const string ISSUER = "admin"; // publisher
        public const string AUDIENCE = "client"; // consumer

        // Теперь этот метод не статический
        static public SymmetricSecurityKey GetSymmetricSecurityKey() =>
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
    }
}
