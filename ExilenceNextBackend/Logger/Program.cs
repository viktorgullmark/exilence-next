
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using Shared.Models;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace BackgroundProcessor
{
    class Program
    {
        public static HubConnection _connection;

        public static async Task Main(string[] args)
        {

            Console.Write($"Type password for logger: ");
            var password = Console.ReadLine();
            Console.WriteLine($"Connecting...");
            await Task.Delay(2000);

            var token = await GetAccessToken();

            _connection = new HubConnectionBuilder().WithUrl("https://localhost:5001/hub",
                 options =>
                 {
                     options.AccessTokenProvider = () => Task.FromResult(token);
                 }).Build();

            _connection.Closed += async (error) =>
            {
                Console.WriteLine($"Disconnected, trying to reconnect in 5000 ms");
                await Task.Delay(5000);
                await _connection.StartAsync();
                await _connection.InvokeAsync("AddLogger", "password");
            };

            _connection.On<string>("Debug", (message) =>
            {
                Console.WriteLine($"{message}");
            });

            var groupModel = new GroupModel()
            {
                Name = "Logger",
                Password = password
            };

            await _connection.StartAsync();
            await _connection.InvokeAsync("AddLogger", groupModel);

            Console.ReadLine();
        }

        private static async Task<string> GetAccessToken()
        {
            using (var httpClient = new HttpClient())
            {
                var accountModel = new AccountModel()
                {
                    ClientId = Guid.NewGuid().ToString(),
                    Name = "Logger"

                };
                var data = JsonSerializer.Serialize(accountModel);
                var result = await httpClient.PostAsync("https://localhost:5001/api/authentication", new StringContent(data, Encoding.UTF8, "application/json"));
                string token = await result.Content.ReadAsStringAsync();
                return token;
            }
        }


    }
}
