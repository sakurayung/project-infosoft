namespace project_infosoft.Models
{
    public class Customer
    {
        public int Id { get; set; }

        public string firstName { get; set; } = string.Empty;

        public string lastName { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
