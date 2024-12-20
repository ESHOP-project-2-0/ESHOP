﻿using System.ComponentModel.DataAnnotations;

namespace AspNetCoreAPI.DTOs
{
    public class OrderDTO
    {
        [Required]
        public string Name { get; set; }
        public string Company { get; set; }
        [Required]
        public string ICO { get; set; }
        [Required]
        public string DIC { get; set; }
        public string ICDPH { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string PostalCode { get; set; }
        [Required]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Note { get; set; }
        [Required]
        public string DeliveryOption { get; set; }
        [Required]
        public string PaymentOption { get; set; }
        [Range(0, 100)]
        public int DiscountAmount { get; set; }
        [Required]
        public string OrderStatus { get; set; }
    }
}
