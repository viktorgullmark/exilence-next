using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace ExilenceTests
{
    [Collection("DatabaseCollection")]
    public class GroupTests
    {
        DatabaseFixture _fixture;

        public GroupTests(DatabaseFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task CreateConnection()
        {
            var connection = new ConnectionModel()
            {
                ConnectionId = TestHelper.GenerateUUID(),
                InstanceName = _fixture.InstanceName,
                Created = DateTime.UtcNow
            };

        }
    }
}
