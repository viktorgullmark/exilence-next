using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Shared.Entities;
using Shared.Enums;
using Shared.Interfaces;
using Shared.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private IAccountService _accountService;
        private IMapper _mapper;
        private string _secret;

        public AuthenticationController(IMapper mapper, IAccountService accountRepository, IConfiguration configuration)
        {
            _mapper = mapper;
            _accountService = accountRepository;
            _secret = configuration.GetSection("Settings")["Secret"];
        }

        [HttpPost]
        public async Task<IActionResult> Token([FromBody]AccountModel accountModel)
        {
            var account = await _accountService.GetAccount(accountModel.Name);

            if (account == null)
            {
                account = await _accountService.AddAccount(accountModel);
            }
            else
            {
                account = await _accountService.EditAccount(accountModel);
            }

            var token = AuthHelper.GenerateToken(_secret, account);

            return Ok(token);
        }
    }
}