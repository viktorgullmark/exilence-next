using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ExternalController : ControllerBase 
    {
        //Used by HAProxy to detect downtime. 
        [Route("")]
        [HttpGet]
        public IActionResult GetStatus()
        {
            return Ok();
        }
    }
}
