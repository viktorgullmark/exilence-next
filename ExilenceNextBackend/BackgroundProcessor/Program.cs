using BackgroundProcessor.Models;
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
        private static bool _keepRunning = true;

        public static async Task Main(string[] args)
        {

            await Task.Delay(4000);

            var response = await GetAccessToken();

            _connection = new HubConnectionBuilder().WithUrl("https://localhost:5001/hub",
                 options =>
                 {
                     options.AccessTokenProvider = () => Task.FromResult(response.Token);
                 }).Build();

            _connection.Closed += async (error) =>
            {
                await Task.Delay(5000);
                await _connection.StartAsync();
            };

            _connection.On<string>("Log", (message) =>
            {
                Console.WriteLine($"{message}");
            });

            Console.CancelKeyPress += async delegate (object sender, ConsoleCancelEventArgs e)
            {
                e.Cancel = true;
                _keepRunning = false;
                await _connection.DisposeAsync();
            };
        }

        private static async Task<TokenModel> GetAccessToken()
        {
            using (var httpClient = new HttpClient())
            {
                var accountModel = new AccountModel()
                {
                    ClientId = Guid.NewGuid().ToString(),
                    Name = "Loggger"

                };
                var data = JsonSerializer.Serialize(accountModel);
                var result = await httpClient.PostAsync("https://localhost:5001/api/authentication", new StringContent(data, Encoding.UTF8, "application/json"));
                string token = await result.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<TokenModel>(token);
            }
        }


    }
}
