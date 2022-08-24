using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class ExternalPriceSparkLineModel
    {
        public List<double?> Data { get; set; }
        public double? TotalChange { get; set; }
    }
}
