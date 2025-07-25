﻿using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.Models
{
    public class ProductModel
    {
        [Key]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Názov produkt je povinný.")]
        [StringLength(100, ErrorMessage = "Názov produktu môže mať maximálne 100 znakov.")]
        [MinLength(3, ErrorMessage = "Názov produktu musí mať aspoň 3 znaky.")]
        public string ProductName { get; set; }

        [StringLength(100, ErrorMessage = "Popis produktu môže mať dĺžku maximálne 250 znakov.")]
        public string ProductDescription { get; set; }

        [Required(ErrorMessage = "Cena produktu je povinná.")]
        [Range(0.01, double.MaxValue, ErrorMessage = ("Cena musí byť väčšia ako 0€."))]
        public decimal ProductPrice { get; set; }
        [Range(0.01, double.MaxValue, ErrorMessage = ("Váha musí byť väčšia ako 0kg."))]
        public decimal? ProductWeight { get; set; }
        [Required(ErrorMessage = "Počet produktov na sklade je povinný.")]
        public int StockAmount { get; set; } = 0;
        [Range(1, int.MaxValue, ErrorMessage = "Kód produktu musí byť číslo medzi 1 a 2147483647.")]
        public int? ProductCode { get; set; }
        [Required(ErrorMessage = "Produkty sú povinné.")]
        public ICollection<OrderProductModel> OrderProducts { get; set; } = new List<OrderProductModel>();
        public bool IsDeleted { get; set; } = false; 
    }
}
