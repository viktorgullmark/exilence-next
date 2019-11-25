using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private IAccountRepository _accountRepository;
        private IMapper _mapper;
        private string _secret;

        public AuthenticationController(IMapper mapper, IAccountRepository accountRepository, IConfiguration configuration)
        {
            _mapper = mapper;
            _accountRepository = accountRepository;
            _secret = configuration.GetSection("Settings")["Secret"];
        }

        [HttpPost]
        public async Task<IActionResult> Token([FromBody]AccountModel accountModel)
        {
            bool verified = false;
            bool valid = false;

            if (true)
            {
                valid = await ValidateSessionId(accountModel.Name, accountModel.SessionId);
                if (!valid)
                    return BadRequest("Could not validate the sessionId");
            }


            var account = await _accountRepository.GetAccount(accountModel.Name);

            if (account == null)
            {
                account = _mapper.Map<Account>(accountModel);
                account = await _accountRepository.CreateAccount(account);
            }

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, account.Name),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            if (account.Role == Role.Admin)
            {
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
            }
            else if (account.Role == Role.Premium)
            {
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Premium"));
            }

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);
            return Ok(new { token = serializedToken });
        }

        private async Task<bool> ValidateSessionId(string accountName, string sessionId)
        {
            if (string.IsNullOrEmpty(sessionId))
            {
                return false;
            }
            return true;
        }

    }
}