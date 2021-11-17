using API.Interfaces;
using AutoMapper;
using MessagePack;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace API.Hubs
{
    public partial class BaseHub : Hub
    {
        public async Task<ExternalPriceModel> PriceItem(PricedItemModel item)
        {
            ExternalPriceModel priceModel = await _priceService.PriceItem(item);
            return priceModel;
        }
        public async Task<List<ExternalPriceModel>> PriceItems(IEnumerable<PricedItemModel> itemModels)
        {
            List<ExternalPriceModel> priceModels = new List<ExternalPriceModel>();
            foreach (PricedItemModel item in itemModels)
            {
                ExternalPriceModel price = await _priceService.PriceItem(item);
                priceModels.Add(price);
            }
            return priceModels;
        }

    }
}
