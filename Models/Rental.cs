using System.ComponentModel.DataAnnotations;

namespace project_infosoft.Models
{
    public class Rental
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int VideoId { get; set; }

        [Required]
        public decimal Price { get; set; }
        public decimal DuePrice { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime ReturnedDate { get; set; }
        public DateTime OverdueDate { get; set; }
        public int Quantity { get; set; }

        [Required] public Boolean isReturned { get; set; }


        // Navigation Properties
        public Customer Customer { get; set; } = null!;
        public Video Video { get; set; } = null!;

    }

}
