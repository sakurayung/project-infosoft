namespace project_infosoft.Models
{
    public class VideoDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public DateTime BorrowedAt { get; set; }
        public DateTime ReturnedAt { get; set; }
        public int Quantity { get; set; }
    }
}
