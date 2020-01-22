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
            };
            connection = await _fixture.GroupService.AddConnection(connection, TestHelper.GetRandomString());


            var groupModel = new GroupModel()
            {
                Name = TestHelper.GetRandomString(),
                Password = TestHelper.GetRandomString()
            };
            groupModel = await _fixture.GroupService.JoinGroup(connection.ConnectionId, groupModel);

            Assert.NotNull(groupModel.ClientId);
            Assert.Single(groupModel.Connections);

            await _fixture.GroupService.LeaveGroup(connection.ConnectionId, groupModel.Name);
            groupModel = await _fixture.GroupService.GetGroup(groupName);

            Assert.Null(groupModel);
        }

    }
}
