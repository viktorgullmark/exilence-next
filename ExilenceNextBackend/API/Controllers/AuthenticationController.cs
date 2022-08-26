using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Models;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Shared.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IAccountService _accountService;
        private readonly string _exilenceSecret;
        private readonly string _pathOfExileClientId;
        private readonly string _pathOfExileClientSecret;

        private readonly string _patreonClientId;
        private readonly string _patreonClientSecret;
        private readonly string _patreonRedirectUrl;

        public AuthenticationController(IAccountService accountRepository, IConfiguration configuration, IHttpClientFactory httpClientFactory, ILogger<AuthenticationController> logger)
        {
            _logger = logger;
            _accountService = accountRepository;
            _httpClientFactory = httpClientFactory;
            _exilenceSecret = configuration.GetSection("Settings")["Secret"];
            _pathOfExileClientId = configuration.GetSection("PathOfExile")["ClientId"];
            _pathOfExileClientSecret = configuration.GetSection("PathOfExile")["ClientSecret"];

            _patreonClientId = configuration.GetSection("Patreon")["ClientId"];
            _patreonClientSecret = configuration.GetSection("Patreon")["ClientSecret"];
            _patreonRedirectUrl = configuration.GetSection("Patreon")["RedirectUrl"];
        }

        [HttpPost]
        [Route("token")]
        public async Task<IActionResult> Token([FromBody] AccountModel accountModel)
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

            var token = AuthHelper.GenerateToken(_exilenceSecret, account);

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
                client.DefaultRequestHeaders.Add("User-Agent", "exilence-next");

                var data = new FormUrlEncodedContent(new[]
                {
                new KeyValuePair<string, string>("client_id", _pathOfExileClientId),
                new KeyValuePair<string, string>("client_secret", _pathOfExileClientSecret),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("grant_type", "authorization_code")
                });
                var response = await client.PostAsync(uri, data);
                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return Ok(content);
                }

                _logger.LogError($"Something went wrong fetching token from code: {code}, reason: {response.ReasonPhrase}");
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
                    client.DefaultRequestHeaders.Add("User-Agent", "exilence-next");


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
                        _logger.LogError($"Something went wrong trying to validate account: {accountName} with token: {accessToken}, reason: {response.ReasonPhrase}");
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError($"Exception when trying to validate account: {accountName} with token: {accessToken}, message: {e.Message}");
                return false;
            }

            return false;

        }

        [HttpGet]
        [Route("redirect")]
        public IActionResult Redirect(string code, string state)
        {
            return Redirect($"exilence://?code={code}&state={state}");
        }


        [HttpGet]
        [Route("patreon")]
        public async Task<IActionResult> PatreonOauth2(string code, string state)
        {
            string uri = "https://www.patreon.com/api/oauth2/token";

            using (var client = _httpClientFactory.CreateClient())
            {
                client.DefaultRequestHeaders.Add("User-Agent", "exilence-next");

                var data = new FormUrlEncodedContent(new[]
                {
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", _patreonRedirectUrl),
                new KeyValuePair<string, string>("client_id", _patreonClientId),
                new KeyValuePair<string, string>("client_secret", _patreonClientSecret),
                new KeyValuePair<string, string>("grant_type", "authorization_code")
                });
                var response = await client.PostAsync(uri, data);
                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    PatreonOauthResponse responseModel = JsonSerializer.Deserialize<PatreonOauthResponse>(content, options);
                    await SavePatreonAccount(responseModel);
                    return Ok(responseModel);
                }

                _logger.LogError($"Something went wrong fetching token from code: {code}, reason: {response.ReasonPhrase}");
                return BadRequest(content);
            }
        }

        private async Task SavePatreonAccount(PatreonOauthResponse patreonOauthResponse)
        {

            string accountName = User.Identity.Name;

            var patreonAccount = new PatreonAccountModel()
            {
                AccessToken = patreonOauthResponse.AccessToken,
                RefreshToken = patreonOauthResponse.RefreshToken,
                TokenType = patreonOauthResponse.TokenType,
                ExpiresIn = patreonOauthResponse.ExpiresIn
            };

            await _accountService.AddPatreonAccount(accountName, patreonAccount);
        }
    }
}