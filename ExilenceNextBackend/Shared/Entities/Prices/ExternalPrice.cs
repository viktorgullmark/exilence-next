﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities.Prices
{
    public class ExternalPrice
    {
        public string Name { get; set; }
        public double Calculated { get; set; }
        public int? FrameType { get; set; }
        public string Variant { get; set; }
        public bool? Elder { get; set; }
        public bool? Shaper { get; set; }
        public int? Links { get; set; }
        public int? Quality { get; set; }
        public int? Ilvl { get; set; }
        public int? Level { get; set; }
        public bool? Corrupted { get; set; }
        public string Icon { get; set; }
        public int? Tier { get; set; }
        public int Count { get; set; }
        public string DetailsUrl { get; set; }
        public ExternalPriceSparkLine SparkLine { get; set; }
    }
}
