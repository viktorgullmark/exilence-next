using Microsoft.IdentityModel.Tokens;
using Shared.Enums;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class AuthHelper
    {
        public static string GenerateToken(string secret, AccountModel accountModel)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, accountModel.Name),
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            if (accountModel.Role == Role.Admin)
            {
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Admin"));
            }
            else if (accountModel.Role == Role.Premium)
            {
                tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, "Premium"));
            }

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var serializedToken = tokenHandler.WriteToken(token);
            return serializedToken;
        }
    }
}
