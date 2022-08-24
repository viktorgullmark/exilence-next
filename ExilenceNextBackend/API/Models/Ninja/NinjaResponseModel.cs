using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Models.Ninja
{
    public class NinjaCombinedLineModel
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public int? MapTier { get; set; }
        public int? LevelRequired { get; set; }
        public string Variant { get; set; }
        public int? Links { get; set; }
        public int? ItemClass { get; set; }
        public NinjaSparkLineModel Sparkline { get; set; }
        public NinjaSparkLineModel LowConfidenceSparkline { get; set; }
        public bool? Corrupted { get; set; }
        public int? GemLevel { get; set; }
        public int? GemQuality { get; set; }
        public double? ChaosValue { get; set; }
        public int? Count { get; set; }
        public string CurrencyTypeName { set => Name = value; }
        public string DetailsId { get; set; }
        public double? ChaosEquivalent { get; set; }
        public NinjaPayReceiveModel Receive { get; set; }
        public NinjaCurrencyDetailModel Details { get; set; } // Populated in controller
    }

    public class NinjaPayReceiveModel
    {
        public int Count { get; set; }
        public double Value { get; set; }
    }

    public class NinjaSparkLineModel
    {
        public List<double?> Data { get; set; }
        public double TotalChange { get; set; }
    }
    public class NinjaCurrencyDetailModel
    {
        public string Name { get; set; }
    }

    public class NinjaResponseModel
    {
        public List<NinjaCombinedLineModel> Lines { get; set; }
        public List<NinjaCurrencyDetailModel> CurrencyDetails { get; set; }
    }
}
