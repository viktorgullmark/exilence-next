using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class CustomLeaguePriceModel
    {
        public string LeagueId { get; set; }
        public List<ExternalPriceModel> Prices { get; set; }
    }
}
