using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR.Client;
using System.Text;
using System.Threading.Tasks;
using System.Linq;

namespace BackgroundProcessor
{
    public class CommandHandler
    {
        public async Task RouteCommand(string commandLine)
        {
            string[] commandParts = commandLine.Split(' ');
            var command = commandParts.ElementAtOrDefault(0);
            var commandData = commandParts.ElementAtOrDefault(1);

            switch (command)
            {
                case "join":
                    await JoinGroup(commandData);
                    break;
                case "leave":
                    await LeaveGroup(commandData);
                    break;


                default:
                    Console.WriteLine("Command not recogniozed!");
                    break;
            }
        }

        public async Task JoinGroup(string group)
        {
            await Program._connection.InvokeAsync("JoinGroup", group);
        }

        public async Task LeaveGroup(string group)
        {
            await Program._connection.InvokeAsync("LeaveGroup", group);
        }
    }
}
