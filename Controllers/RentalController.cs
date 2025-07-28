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
                    Price = x.Price,
                    OverdueDate = x.OverdueDate,
                    ReturnedDate = x.ReturnedDate,
                    BorrowedDate = x.BorrowedDate,
                    Quantity = x.Quantity,
                    isReturned = x.isReturned,
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
                    }
                }).ToListAsync();
            return Ok(rentals);
        }

        //GET: api/rental/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RentalDTO>> GetRentalById(int id)
        {
            var rental = await _context.Rental
                .Include(r => r.Customer)
                .Include(r => r.Video)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (rental == null)
            {
                return NotFound();
            }
            return Ok(RentalToDTO(rental));
        }


        //POST: api/rental/rent
        [HttpPost("rent")]
        public async Task<ActionResult<RentalDTO>> RentVideo([FromBody] RentalDTO rentalDto)
        {

            var video = await _context.Video.FindAsync(rentalDto.VideoId);
            var customer = await _context.Customer.FindAsync(rentalDto.CustomerId);

            if (video == null || customer == null)
            {
                return NotFound(new { message = "Customer or video not found" });
            }

            var quantity = rentalDto.Quantity > 0 ? rentalDto.Quantity : 1;
            decimal basePrice = video.Category == "VCD" ? 25m : video.Category == "DVD" ? 50m : 0;
            decimal totalRentPrice = basePrice * rentalDto.Quantity;

            video.Quantity -= rentalDto.Quantity;

            var rental = new Rental
            {
                CustomerId = rentalDto.CustomerId,
                VideoId = rentalDto.VideoId,
                Price = totalRentPrice,
                BorrowedDate = DateTime.UtcNow,
                OverdueDate = DateTime.UtcNow.AddDays(3),
                ReturnedDate = rentalDto.ReturnedDate,
                Quantity = rentalDto.Quantity,
                isReturned = rentalDto.isReturned
            };

            _context.Entry(video).State = EntityState.Modified;
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
            rental.isReturned = true;

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
                Quantity = rental.Quantity,
                BorrowedDate = rental.BorrowedDate,
                OverdueDate = rental.OverdueDate,
                ReturnedDate = rental.ReturnedDate,
                isReturned = rental.isReturned,
                Customer = new CustomerDTO {
                    Id = rental.Customer.Id,
                    firstName = rental.Customer.firstName,
                    lastName = rental.Customer.lastName,
                },
                Video = new VideoDTO
                {
                    Id = rental.Video.Id,
                    Title = rental.Video.Title,
                    Category = rental.Video.Category,
                }
            };

    }
}
