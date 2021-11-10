using API.Interfaces;
using API.Models;
using API.Models.Ninja;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Shared.Models;
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
        private readonly IPriceService _priceService;
        readonly IMapper _mapper;

        public PriceController(IHttpClientFactory httpClientFactory, ILogger<PriceController> logger, ICacheService cacheService, IPriceService priceService, IMapper mapper)
        {
            _httpClientFactory = httpClientFactory;
            _cacheService = cacheService;
            _priceService = priceService;
            _logger = logger;
            _mapper = mapper;
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<IActionResult> GetPrice(string id)
        {
            return Ok();
        }


        [Route("currency")]
        [HttpPost]
        public async Task<IActionResult> AddCurrencyPrices([FromBody] NinjaResponseModel ninjaResponseModel)
        {
            return Ok();
        }

        [Route("item")]
        [HttpPost]
        public async Task<IActionResult> AddItemPrices([FromBody] NinjaResponseModel ninjaResponseModel)
        {
            try
            {
                List<ExternalPriceModel> externalPriceModels = _mapper.Map<List<ExternalPriceModel>>(ninjaResponseModel.Lines);

                if (ninjaResponseModel.CurrencyDetails != null)
                {
                    foreach (NinjaCombinedLineModel line in ninjaResponseModel.Lines)
                    {
                        line.Details = ninjaResponseModel.CurrencyDetails.FirstOrDefault(c => c.Name == line.Name);
                    }
                }

                await _priceService.AddPrices(externalPriceModels);
            }
            catch (Exception e)
            {
                throw e;
            }

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
