using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_infosoft.Data;

namespace project_infosoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryReportController : Controller
    {
        private readonly RentalContext _context;

        public InventoryReportController(RentalContext context)
        {
            _context = context;
        }

        [HttpGet("video-inventory")]
        public async Task<IActionResult> GetInventoryReport()
        {
            var report = await _context.Video
                .OrderBy(v => v.Title)
                .Select(v => new
                {
                    v.Id,
                    v.Title,
                    v.Category,
                    TotalQuantity = v.Quantity,
                    QuantityRented = _context.Rental.Count(r => r.VideoId == v.Id && r.ReturnedDate == DateTime.MinValue),
                    QuantityInside = v.Quantity - _context.Rental.Count(r => r.VideoId == v.Id && r.ReturnedDate == DateTime.MinValue)
                }).ToListAsync();

            return Ok(report);
        }

        [HttpGet("customer-rentals/{customerId}")]
        public async Task<IActionResult> GetCustomerRentalsReport(int customerId)
        {
            var customer = await _context.Customer.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound(new { message = "Customer not found" });
            }

            var rentals = await _context.Rental
                .Where(r => r.CustomerId == customerId && r.ReturnedDate == DateTime.MinValue)
                .Include(r => r.Video)
                .Select(r => new
                {
                    RentalId = r.Id,
                    VideoTitle = r.Video.Title,
                    VideoCategory = r.Video.Category,
                    Price = r.Price,
                    OverdueDate = r.OverdueDate,
                    DaysRemaining = (r.OverdueDate - DateTime.UtcNow).Days
                })
                .ToListAsync();

            var report = new
            {
                CustomerId = customer.Id,
                CustomerName = $"{customer.firstName} {customer.lastName}",
                CurrentRentals = rentals
            };

            return Ok(report);
        }
    }
}
