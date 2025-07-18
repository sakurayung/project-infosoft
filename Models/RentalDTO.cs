using System.ComponentModel.DataAnnotations;

namespace project_infosoft.Models
{
    public class RentalDTO
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int VideoId { get; set; }
        [Required]
        [PriceConstraint]
        public decimal Price { get; set; }
        public DateTime BorrowedDate { get; set; }
        public DateTime OverdueDate { get; set; }
        public DateTime ReturnedDate { get; set; }

        public CustomerDTO? Customer { get; set; }
        public VideoDTO? Video { get; set; }
    }
}
