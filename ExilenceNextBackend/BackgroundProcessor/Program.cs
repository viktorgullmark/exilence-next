using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BackgroundProcessor
{
    class Program
    {
        public static HubConnection _connection;
        private static bool _keepRunning = true;


        public static async Task Main(string[] args)
        {

            await Task.Delay(2000);

            _connection = new HubConnectionBuilder().WithUrl("https://localhost:5001/hub").Build();

            _connection.Closed += async (error) =>
            {
                await Task.Delay(5000);
                await _connection.StartAsync();
            };

            _connection.On<string>("Log", (message) => {
                Console.WriteLine($"{DateTime.Now.ToShortTimeString()} Server: {message}");
            });






            Console.CancelKeyPress += async delegate (object sender, ConsoleCancelEventArgs e)
            {
                e.Cancel = true;
                _keepRunning = false;
                await _connection.DisposeAsync();
            };

            await _connection.StartAsync();

            var commandHandler = new CommandHandler();

            while (_keepRunning)
            {
                var commandLine = Console.ReadLine();
                await commandHandler.RouteCommand(commandLine);


            }
        }



    }
}
