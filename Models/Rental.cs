using System.ComponentModel.DataAnnotations;

namespace project_infosoft.Models
{
    public class Rental
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int VideoId { get; set; }

        [Required]
        [PriceConstraint]
        public decimal Price { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }
        public DateTime OverdueDate { get; set; }

        // ONE-TO-MANY RELATIONSHIP
        public Customer Customer { get; set; } = null!;
        public Video Video { get; set; } = null!;
    }

    public class PriceConstraintAttribute : ValidationAttribute 
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is decimal and (25m or 50m))
            {
                return ValidationResult.Success;
            }

            return new ValidationResult("Price must be either 25 or 50 pesos");
        }
    }
}
