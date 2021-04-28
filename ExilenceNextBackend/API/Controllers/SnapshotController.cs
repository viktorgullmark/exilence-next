using API.ApiModels;
using API.Hubs;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SnapshotController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ISnapshotService _snapshotService;
        public SnapshotController(IConfiguration configuration, ISnapshotService snapshotService)
        {
            _configuration = configuration;
            _snapshotService = snapshotService;
        }

        //Used by client on startup to bulk load all snapshots for a profile
        [Route("")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetSnapshotsWithItemsForProfile(string profileId)
        {
            List<SnapshotModel> snapshotWithItemsForProfile = await _snapshotService.GetSnapshotsForProfile(profileId);
            return Ok(snapshotWithItemsForProfile);
        }

    }
}
