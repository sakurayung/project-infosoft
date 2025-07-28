using System.ComponentModel.DataAnnotations;

namespace project_infosoft.Models
{
    public class Video
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        [Required]
        public string Category { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime BorrowedAt { get; set; }
        public DateTime ReturnedAt { get; set; }
        [Required]
        [Range(1,3)]
        public int RentDays { get; set; }
        public int Quantity { get; set; }


    }
}
