﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using project_infosoft.Data;
using project_infosoft.Models;

namespace project_infosoft.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VideoController : Controller
    {
        private readonly RentalContext _context;

        public VideoController(RentalContext context)
        {
            _context = context;
        }

        //GET: api/Video
        [HttpGet]
        public async Task<ActionResult<VideoDTO>> GetAllVideo()
        {
            var videos = await _context.Video.Select(x => new VideoDTO
            {
                Id = x.Id,
                Title = x.Title,
                Category = x.Category,
                BorrowedAt = x.BorrowedAt,
                ReturnedAt = x.ReturnedAt,
                Quantity = x.Quantity
            }).ToListAsync();

            return Ok(videos);
        }

        //GET: api/video/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDTO>> GetVideoById(int id)
        {
            var video = await _context.Video.FindAsync(id);

            if (video == null)
            {
                return NotFound();
            }
            return Ok(video);
        }

        //PUT: api/video/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<VideoDTO>> UpdateVideoById(int id, VideoDTO videoDto)
        {
            if (id != videoDto.Id)
            {
                return BadRequest();
            }

            var video = await _context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            video.Title = videoDto.Title;
            video.Category = videoDto.Category;

            _context.Entry(video).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) when (!VideoExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        //POST: api/video
        [HttpPost]
        public async Task<ActionResult<VideoDTO>> AddVideo(VideoDTO videoDto)
        {
            
            // Category should only be VCD OR DVD
            if (videoDto.Category != "DVD" && videoDto.Category != "VCD")
            {
                return BadRequest("Category must be either DVD or VCD");
            }

            var video = new Video
            {
                Title = videoDto.Title,
                Category = videoDto.Category,
                BorrowedAt = DateTime.UtcNow,
                ReturnedAt = videoDto.ReturnedAt,
                Quantity = videoDto.Quantity > 0 ? videoDto.Quantity : 1,
            };

            _context.Video.Add(video);
            await _context.SaveChangesAsync();
            return CreatedAtAction(
                nameof(GetVideoById), new { id = video.Id }, VideoToDTO(video));
        }

        //DELETE: api/video/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideo(int id)
        {
            var video = await _context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            _context.Video.Remove(video);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VideoExists(int id)
        {
            return _context.Video.Any(e => e.Id == id);
        }

        private static VideoDTO VideoToDTO(Video video) =>
            new VideoDTO
            {
                Id = video.Id,
                Title = video.Title,
                Category = video.Category,
                BorrowedAt = video.BorrowedAt,
                ReturnedAt = video.ReturnedAt
            };

    }
}
