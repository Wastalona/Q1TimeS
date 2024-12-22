using System.ComponentModel.DataAnnotations;
namespace Q1TimeS.Models.Db
{
    public class TrustedIP
    {
        [Key]
        public int AddressId { get; set; }
        [Required]
        [RegularExpression(@"^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$",
        ErrorMessage = "Введите корректный IP-адрес")]
        public string? IPaddress { get; set; }
    }
}
