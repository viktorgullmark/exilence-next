using API.Interfaces;
using API.Models;
using API.Models.Ninja;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PriceController : ControllerBase
    {
        private readonly ILogger<PriceController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ICacheService _cacheService;
        private readonly INinjaService _ninjaService;

        public PriceController(IHttpClientFactory httpClientFactory, ILogger<PriceController> logger, ICacheService cacheService, INinjaService ninjaService)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
            _ninjaService = ninjaService;
            _logger = logger;
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetPrice(string id)
        {
            var result = await _ninjaService.GetPrice(id);
            return Ok(result);
        }


        [Route("")]
        [HttpPost]
        public async Task<IActionResult> AddPrices([FromBody] List<NinjaCurrencyLineModel> list)
        {


            return Ok();
        }

        [Route("{overviewType}/{league}/{type}/{language}")]
        [HttpGet]
        public async Task<IActionResult> GetPrices(NinjaOverviewTypeEnum overviewType, string league, string type, string language)
        {
            string cacheKey = BuildCacheKey(overviewType, league, type, language);
            string prices = await _cacheService.Get(cacheKey);
            if (prices == null)
            {
                string url = BuildUrl(overviewType, league, type, language);
                PriceResponseModel priceModel = await GetPricesFromNinja(url);
                await _cacheService.Add(cacheKey, priceModel.Data, priceModel.Expires);
                prices = priceModel.Data;
            }
            return Ok(prices);
        }

        private string BuildCacheKey(NinjaOverviewTypeEnum overviewType, string league, string type, string language)
        {
            return $"{overviewType}{league}{type}{language}";
        }

        private string BuildUrl(NinjaOverviewTypeEnum overviewType, string league, string type, string language)
        {
            string url = "https://poe.ninja/api/data/";
            switch (overviewType)
            {
                case NinjaOverviewTypeEnum.Currency:
                    url += $"ItemOverview/";
                    break;
                case NinjaOverviewTypeEnum.Item:
                    url += $"CurrencyOverview/";
                    break;
            }
            url += $"?league={league}&type={type}&language={language}";
            return url;
        }

        private async Task<PriceResponseModel> GetPricesFromNinja(string url)
        {
            using HttpClient client = _httpClientFactory.CreateClient();
            HttpResponseMessage response = await client.GetAsync(url);

            //Default expiry
            DateTime absoluteExpireTime = DateTime.UtcNow.AddMinutes(1);

            if (response.Headers.TryGetValues("age", out IEnumerable<string> ageHeader) &&
                response.Headers.TryGetValues("cache-control", out IEnumerable<string> cacheControlHeader))
            {
                string age = ageHeader.First();
                string cacheControl = cacheControlHeader.First();
                string maxAge = cacheControl[(cacheControl.LastIndexOf("=") + 1)..];

                if (int.TryParse(age, out int ageInSeconds) && int.TryParse(maxAge, out int maxAgeInSeconds))
                {
                    int expiresInSeconds = maxAgeInSeconds - ageInSeconds;
                    absoluteExpireTime = DateTime.UtcNow.AddSeconds(30);
                }
            }

            string prices = await response.Content.ReadAsStringAsync();

            return new PriceResponseModel()
            {
                Expires = absoluteExpireTime,
                Data = prices
            };
        }
    }
}
