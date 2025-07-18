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
                    QuantityRented = _context.Rental.Count(r => r.VideoId == r.Id && r.ReturnedDate == DateTime.MinValue),
                    QuantityInside = v.Quantity - _context.Rental.Count(r => r.VideoId == r.Id && r.ReturnedDate == DateTime.MinValue)
                }).ToListAsync();

            return Ok(report);
        }
    }
}
