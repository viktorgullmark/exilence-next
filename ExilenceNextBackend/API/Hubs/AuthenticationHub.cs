using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        /* TO IMPLEMENT
         * Create Account / Login to Account and get Roles
         * Roles, connected to accountName in PoE 
         * 
         */

        public async Task<AccountModel> AccountLogin(AccountModel accountModel)
        {
            var account = await _accountRepository.GetAccount(accountModel.Name);
            if (account != null)
            {   
                return _mapper.Map<AccountModel>(account); ;
            }
            else
            {
                account = _mapper.Map<Account>(accountModel);
                account = await _accountRepository.CreateAccount(account);
                return _mapper.Map<AccountModel>(account);
            }
        }

    }
}
