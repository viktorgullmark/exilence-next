using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities.Prices
{
    public class ExternalPriceSparkLine
    {
        public IEnumerable<double?> Data { get; set; }
        public int? TotalChange { get; set; }
    }
}
