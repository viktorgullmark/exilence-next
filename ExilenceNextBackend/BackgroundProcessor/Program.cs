using BackgroundProcessor.Models;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
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
                 }).AddMessagePackProtocol().Build();

            _connection.Closed += async (error) =>
            {
                await Task.Delay(5000);
                await _connection.StartAsync();
            };

            _connection.On<string>("Log", (message) =>
            {
                Console.WriteLine($"{DateTime.Now.ToShortTimeString()} Server: {message}");
            });


            Console.CancelKeyPress += async delegate (object sender, ConsoleCancelEventArgs e)
            {
                e.Cancel = true;
                _keepRunning = false;
                await _connection.DisposeAsync();
            };

            var commandHandler = new CommandHandler();
            StartupMessage();
            while (_keepRunning)
            {
                try
                {
                    var commandLine = Console.ReadLine();
                    await commandHandler.RouteCommand(commandLine);

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
        }

        private static async Task<TokenModel> GetAccessToken()
        {
            using (var httpClient = new HttpClient())
            {
                var data = "{\"name\": \"Umaycry\", \"sessionId\": \"Umaycry\"}";
                var result = await httpClient.PostAsync("https://localhost:5001/api/authentication", new StringContent(data, Encoding.UTF8, "application/json"));
                string token = await result.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<TokenModel>(token);
            }
        }

        public static void StartupMessage()
        {
            Console.WriteLine("Welcome to Exilence ");
            Console.WriteLine("Available commands are: connect, and then join XXX or leave XXX");
        }   

    }
}
