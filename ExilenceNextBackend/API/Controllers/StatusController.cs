using API.Models;
using API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly IHubContext<BaseHub> _hubContext;
        private readonly IConfiguration _configuration;
        public StatusController(IConfiguration configuration, IHubContext<BaseHub> hubContext)
        {
            _hubContext = hubContext;
            _configuration = configuration;
        }

        //Used by HAProxy to detect downtime. 
        [Route("")]
        [HttpGet]
        public IActionResult GetStatus()
        {
            return Ok();
        }

        [Route("announcement")]
        [HttpPost]
        public async Task<IActionResult> Announcement(AnouncementModel announcement)
        {
            var password = _configuration.GetSection("Announcement")["Password"];
            var message = new AnouncementMessageModel()
            {
                Title = announcement.Title,
                Message = announcement.Message
            };

            if (password == null || announcement.Password != password)
                return BadRequest(new { result = "Wrong password" });

            await _hubContext.Clients.All.SendAsync("OnAnnouncement", message);
            return Ok(new { result = "Message sent" });
        }
    }
}
