using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.ApiModels;
using API.Helpers;
using API.Hubs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {

        private readonly IHubContext<AuthenticationHub> _hubContext;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IAccountService _accountService;
        private readonly string _secret;
        private readonly string _clientId;
        private readonly string _clientSecret;

        public AuthenticationController(IAccountService accountRepository, IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AuthenticationController> logger)
        {
            _accountService = accountRepository;
            _secret = configuration.GetSection("Settings")["Secret"];
            _httpClientFactory = httpClientFactory;
            _clientId = configuration.GetSection("OAuth2")["ClientId"];
            _clientSecret = configuration.GetSection("OAuth2")["ClientSecret"];
            _logger = logger;
        }

        [HttpPost]
        [Route("token")]
        public async Task<IActionResult> Token([FromBody]AccountModel accountModel)
        {
            var accountValid = await ValidateAccount(accountModel.Name, accountModel.AccessToken);
            if (!accountValid)
            {
                _logger.LogError($"[Account: {accountModel.Name}] -  Token has expired for account with Id: {accountModel.ClientId}");
                return BadRequest("error:token_expired");
            }

            var account = await _accountService.GetAccount(accountModel.Name);
            var userAgent = Request.Headers["User-Agent"].ToString();
            var version = MiscHelper.VersionFromUserAgent(userAgent);

            accountModel.Version = version;

            if (account == null)
            {
                account = await _accountService.AddAccount(accountModel);
            }
            else
            {
                await _accountService.EditAccount(accountModel);

            }

            var token = AuthHelper.GenerateToken(_secret, account);

            account.AccessToken = token;

            return Ok(account);
        }

        [HttpGet]
        [Route("oauth2")]
        public async Task<IActionResult> OAuth2(string code)
        {
            string uri = "https://www.pathofexile.com/oauth/token";

            using (var client = _httpClientFactory.CreateClient())
            {
                var data = new FormUrlEncodedContent(new[]
                {
                new KeyValuePair<string, string>("client_id", _clientId),
                new KeyValuePair<string, string>("client_secret", _clientSecret),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("grant_type", "authorization_code")
                });
                var response = await client.PostAsync(uri, data);
                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return Ok(content);
                }

                _logger.LogError($"Something went wrong fetching token from code: {code}", response.ReasonPhrase);
                return BadRequest(content);
            }
        }

        public async Task<bool> ValidateAccount(string accountName, string accessToken)
        {
            string uri = "https://www.pathofexile.com/api/profile";

            try
            {

                using (var client = _httpClientFactory.CreateClient())
                {
                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");

                    var response = await client.GetAsync(uri);
                    var content = await response.Content.ReadAsStringAsync();

                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var model = JsonSerializer.Deserialize<ProfileEndpointModel>(content, options);

                    if (response.IsSuccessStatusCode)
                    {
                        if (model.Name == accountName)
                        {
                            return true;
                        }
                        else
                        {
                            _logger.LogError($"Mismatch between said accountName: {accountName} and accountName fetched from GGG: {model.Name}.");
                        }
                    }
                    else
                    {
                        _logger.LogError($"Something went wrong trying to validate account: {accountName} with token: {accessToken}", response.ReasonPhrase);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Exception when trying to validate account: {accountName} with token: {accessToken}", e.Message);
                return false;
            }

            return false;

        }

        [HttpGet]
        [Route("Callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            await _hubContext.Clients.Group(state).SendAsync("Callback", code);
            _logger.LogInformation($"Callback with code: {code} and state: {state} invoked on client.");
            return Ok();
        }

        [HttpGet]
        [Route("Redirect")]
        public async Task<IActionResult> Redirect(string code, string state)
        {
            return Redirect($"exilence://?code={code}&state={state}");
        }
    }
}