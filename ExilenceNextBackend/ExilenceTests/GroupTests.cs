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

            connection = await _fixture.GroupService.AddConnection(connection, TestHelper.GetRandomString());

            Assert.NotNull(connection.ConnectionId);
        }


        [Fact]
        public async Task JoinGroup()
        {
            var groupName = TestHelper.GetRandomString();
            var connection = new ConnectionModel()
            {   
                ConnectionId = TestHelper.GenerateUUID(),
                InstanceName = _fixture.InstanceName,
                Created = DateTime.UtcNow
            };
            connection = await _fixture.GroupService.AddConnection(connection, TestHelper.GetRandomString());

            var group = await _fixture.GroupService.JoinGroup(connection.ConnectionId, groupName);

            Assert.NotNull(group.ClientId);
            Assert.Single(group.Connections);

            await _fixture.GroupService.LeaveGroup(connection.ConnectionId, groupName);
            group = await _fixture.GroupService.GetGroup(groupName);

            Assert.Null(group);
        }

    }
}
