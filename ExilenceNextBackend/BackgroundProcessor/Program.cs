using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Threading.Tasks;

namespace BackgroundProcessor
{
    class Program
    {
        private static HubConnection _connection;
        private static bool _keepRunning = true;


        public static async Task Main(string[] args)
        {
            _connection = new HubConnectionBuilder().WithUrl("https://localhost:5001/hub").Build();

            _connection.Closed += async (error) =>
            {
                await Task.Delay(5000);
                await _connection.StartAsync();
            };

            _connection.On<string>("Pong", (message) => {

                Console.WriteLine($"Retrived: {message}");

            });


            Console.CancelKeyPress += async delegate (object sender, ConsoleCancelEventArgs e)
            {
                e.Cancel = true;
                _keepRunning = false;
                await _connection.DisposeAsync();
            };

            await _connection.StartAsync();

            while (_keepRunning)
            {
                var debug = Console.ReadLine();

                Console.WriteLine("Sending ping");
                await _connection.InvokeAsync("ping", "ping");


            }
        }
    }
}
