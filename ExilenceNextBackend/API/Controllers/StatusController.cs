using API.ApiModels;
using API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
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
            if (announcement.Password != _configuration.GetSection("Accouncement")["Password"])
                return BadRequest(new { result = "Wrong password" });

            await _hubContext.Clients.All.SendAsync("OnAnnouncement", announcement);
            return Ok(new { result = "Message sent" });
        }
    }
}
