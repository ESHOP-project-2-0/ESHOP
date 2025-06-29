using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class OrderStatusModel
    {
        [Key]
        public int StatusId { get; set; }
        [Required(ErrorMessage = "N�zov stavu je povinn�.")]
        [StringLength(100, ErrorMessage = "N�zov stavu nesmie by� dlh�� ako 100 znakov.")]
        public string StatusName { get; set; } = null!; // null-forgiving operator
        [Required(ErrorMessage = "Poradie je povinn�.")]
        [Range(0, int.MaxValue, ErrorMessage = "Poradie stavu nesmie by� z�porn� a presahova� maxim�lnu hodnotu.")]
        public int SortOrder { get; set; }
        [Required]
        [MaxLength(20, ErrorMessage = "Farba stavu m��e ma� maxim�lne 20 znakov.")]
        public string StatusColor { get; set; } = null!;
    }
}
