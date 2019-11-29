using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR.Client;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using System.Threading;

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
                case "connect":
                    await Program._connection.StartAsync();
                    break;
                case "join":
                    await JoinGroup(commandData);
                    break;
                case "leave":
                    await LeaveGroup(commandData);
                    break;
                case "snapshots":
                    await DownloadSnapshots(int.Parse(commandData));
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

        public async Task DownloadSnapshots(int snapshotsToFetch)
        {
            // Call "Cancel" on this CancellationTokenSource to send a cancellation message to
            // the server, which will trigger the corresponding token in the hub method.
            var cancellationTokenSource = new CancellationTokenSource();
            var snapshots = Program._connection.StreamAsync<int>("DownloadSnapshots", snapshotsToFetch, 100, cancellationTokenSource.Token);


            Console.WriteLine("Retriving snapshots: ");
            await foreach (var snapshot in snapshots)
            {
                Console.Write($" {snapshot},");
            }

            Console.WriteLine("Finished retriving snapshots");
        }


    }
}
