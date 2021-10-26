using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class ExternalPriceSparkLineModel
    {
        public IEnumerable<double?> Data { get; set; }
        public int? TotalChange { get; set; }
    }
}
