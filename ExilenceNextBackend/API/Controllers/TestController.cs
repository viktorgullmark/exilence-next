using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Entities;
using Shared.Interfaces;
using Shared.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private IAccountRepository _accountRepository;
        private IMapper _mapper;

        public TestController(IMapper mapper, IAccountRepository accountRepository)
        {
            _mapper = mapper;
            _accountRepository = accountRepository;
        }

        [HttpPost]
        public async Task<AccountModel> Post([FromBody] SnapshotModel snapshotModel)
        {
            var account = _mapper.Map<Snapshot>(snapshotModel);
            return _mapper.Map<AccountModel>(account);
        }
    }
}