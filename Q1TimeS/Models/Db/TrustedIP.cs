using System.ComponentModel.DataAnnotations;
namespace Q1TimeS.Models.Db
{
    public class TrustedIP
    {
        [Key]
        public int AddressId { get; set; }
        public string? IPaddress { get; set; }
    }
}
