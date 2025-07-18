using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_infosoft.Data;
using project_infosoft.Models;

namespace project_infosoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalController : Controller
    {

        private readonly RentalContext _context;

        public RentalController(RentalContext context)
        {
            _context = context;
        }

        //GET: api/rental
        [HttpGet]
        public async Task<ActionResult<List<RentalDTO>>> GetAllRentalVideo()
        {
            var rentals = await _context.Rental.Include(x => x.Customer)
                .Include(x => x.Video)
                .Select(x => new RentalDTO
                {
                    Id = x.Id,
                    CustomerId = x.CustomerId,
                    VideoId = x.VideoId,
                    OverdueDate = x.OverdueDate,
                    Customer = new CustomerDTO
                    {
                        Id = x.Customer.Id,
                        firstName = x.Customer.firstName,
                        lastName = x.Customer.lastName,
                    },
                    Video = new VideoDTO
                    {
                        Id = x.Video.Id,
                        Title = x.Video.Title,
                        Category = x.Video.Category,
                        BorrowedAt = x.Video.BorrowedAt,
                        ReturnedAt = x.Video.ReturnedAt
                    }
                }).ToListAsync();
            return Ok(rentals);
        }

        //GET: api/rental/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RentalDTO>> GetRentalById(int id)
        {
            var rental = await _context.Rental.FindAsync(id);
            if (rental == null)
            {
                return NotFound();
            }
            return Ok(rental);
        }

        //POST: api/rental/rent
        [HttpPost("rent")]
        public async Task<ActionResult<RentalDTO>> RentVideo([FromBody] RentalDTO rentalDto)
        {

            var video = await _context.Video.FindAsync(rentalDto.VideoId);
            if (video == null)
            {
                return BadRequest("Video not found");
            }

            // ternary operator for VCD Category is 25 pesos and DVD Category is 50 pesos
            decimal price = video.Category == "VCD" ? 25m : video.Category == "DVD" ? 50m : 0;
            var rental = new Rental
            {
                CustomerId = rentalDto.CustomerId,
                VideoId = rentalDto.VideoId,
                Price = price,
                OverdueDate = rentalDto.OverdueDate,
                ReturnedDate = DateTime.MinValue,
                Quantity = rentalDto.Quantity
            };


            _context.Rental.Add(rental);
            await _context.SaveChangesAsync();

            var rentalWithNavigation = await _context.Rental
                .Include(r => r.Customer)
                .Include(r => r.Video)
                .FirstOrDefaultAsync(r => r.Id == rental.Id);

            return CreatedAtAction(
                nameof(GetRentalById), new { id = rental.Id }, RentalToDTO(rentalWithNavigation!));
        }

        //PUT: api/rental/return/{id}
        [HttpPut("return/{id}")]
        public async Task<IActionResult> ReturnVideoRental(int id)
        {
            var rental = await _context.Rental
                .Include(r => r.Video)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (rental == null)
            {
                return NotFound();
            }

            rental.ReturnedDate = DateTime.UtcNow;

            // Videos that are due are charged for 5 pesos per day after the overdue date.
            if (rental.ReturnedDate > rental.OverdueDate)
            {
                int overdueDays = (rental.ReturnedDate.Date - rental.OverdueDate.Date).Days;
                decimal overdueCharge = overdueDays * 5m;
                rental.Price += overdueCharge;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool RentalExists(int id)
        {
            return _context.Rental.Any(e => e.Id == id);
        }

        private static RentalDTO RentalToDTO(Rental rental) =>
            new RentalDTO
            {
                Id = rental.Id,
                CustomerId = rental.CustomerId,
                VideoId = rental.VideoId,
                Price = rental.Price,
                OverdueDate = rental.OverdueDate,
                ReturnedDate = rental.ReturnedDate,
                Customer = new CustomerDTO {
                    Id = rental.Customer.Id,
                    firstName = rental.Customer.firstName,
                    lastName = rental.Customer.lastName,
                    CreatedAt = rental.Customer.CreatedAt
                },
                Video = new VideoDTO
                {
                    Id = rental.Video.Id,
                    Title = rental.Video.Title,
                    Category = rental.Video.Category,
                    BorrowedAt = rental.Video.BorrowedAt,
                    ReturnedAt = rental.Video.ReturnedAt
                }
            };

    }
}
