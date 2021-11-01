using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class PatreonService: IPatreonService
    {
        private readonly IAccountRepository _accountRepository;
        public PatreonService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<bool> IsPatreonSubscriber(string accountName)
        {
            Account account = await _accountRepository.GetAccounts(account => account.Name == accountName).FirstOrDefaultAsync();

            if (account != null && account.PatreonAccount != null)
            {
                var url = "https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields%5Bmember%5D=full_name,patron_status";

                return true;
            }

            return false;
        }
    }
}
