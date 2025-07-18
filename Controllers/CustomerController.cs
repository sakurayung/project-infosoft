using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_infosoft.Data;
using project_infosoft.Models;


namespace project_infosoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        private readonly RentalContext _context;

        public CustomerController(RentalContext context)
        {
            _context = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<CustomerDTO>> GetAllCustomer()
        {
            var customers = await _context.Customer.Select(x => new CustomerDTO
            {
                Id = x.Id,
                firstName = x.firstName,
                lastName = x.lastName,
                CreatedAt = x.CreatedAt,

            }).ToListAsync();

            return Ok(customers);
        }

        //GET: api/Customer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDTO>> GetCustomerById(int id)
        {
            var customers = await _context.Customer.FindAsync(id);

            if (customers == null)
            {
                return NotFound();
            }
            return Ok(customers);
        }

        //PUT: api/Customer/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomerById(int id, CustomerDTO customerDTO)
        {
            if (id != customerDTO.Id)
            {
                return BadRequest();
            }

            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.firstName = customerDTO.firstName;
            customer.lastName = customerDTO.lastName;

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!CustomerExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        //POST: api/Customer
        [HttpPost]
        public async Task<ActionResult<CustomerDTO>> AddCustomer(CustomerDTO customerDTO)
        {
            var customer = new Customer
            {
                firstName = customerDTO.firstName,
                lastName = customerDTO.lastName,
                CreatedAt = DateTime.UtcNow,
            };

            _context.Customer.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetCustomerById), new { id = customer.Id }, CustomerToDTO(customer));
        }

        //DELETE: api/Customer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customer.FindAsync(id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customer.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CustomerExists(int id)
        {
            return _context.Customer.Any(e => e.Id == id);
        }

        private static CustomerDTO CustomerToDTO(Customer customer) =>
            new CustomerDTO
            {
                Id = customer.Id,
                firstName = customer.firstName,
                lastName = customer.lastName
            };
        
    }
}
