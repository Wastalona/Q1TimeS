using Q1TimeS.Interfaces;
using System.Security.Cryptography;
using System.Text;


namespace Q1TimeS.Models
{
    public class Hasher: IHasher
    {
        public string HashPassword(string password)
        /* A method for hashing a password using SHA-256 */
        {
            using (SHA256 sha256Hash = SHA256.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(password)); // in bytes

                // Convert the hash bytes to a HEX string
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                    builder.Append(bytes[i].ToString("x2"));
                return builder.ToString();
            }
        }

        public bool Verify(string password, string hashedPassword){
            string hashedInput = HashPassword(password);
            return string.Equals(hashedInput, hashedPassword);
        }
    }
}
