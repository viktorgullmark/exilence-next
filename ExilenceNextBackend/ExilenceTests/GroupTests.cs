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

            connection = await _fixture.GroupService.AddConnection(connection);

            Assert.NotNull(connection.Id);
        }


        [Fact]
        public async Task JoinGroup()
        {
            var groupName = TestHelper.GetRandomString();

            var connection = new ConnectionModel()
            {   
                Id = 1,
                ConnectionId = TestHelper.GenerateUUID(),
                InstanceName = _fixture.InstanceName,
                Created = DateTime.UtcNow
            };

            var group = await _fixture.GroupService.JoinGroup(connection, groupName);

            await _fixture.GroupService.LeaveGroup(connection, groupName);

            var leftGroup = await _fixture.GroupService.GetGroup(groupName);

            Assert.NotNull(group.Id);
            Assert.Single(group.Connections);


        }

    }
}
