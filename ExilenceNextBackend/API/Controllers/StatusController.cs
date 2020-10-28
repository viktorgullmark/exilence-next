using API.ApiModels;
using API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        public StatusController(IHubContext<BaseHub> hubContext)
        {

            _hubContext = hubContext;
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
            await _hubContext.Clients.All.SendAsync("announcement", announcement);

            return Ok(announcement);
        }
    }
}
