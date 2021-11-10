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
        public int? StackSize { get; set; }
        public int? LevelRequired { get; set; }
        public string BaseType { get; set; }
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
        public NinjaPayReceiveModel Pay { get; set; }
        public NinjaPayReceiveModel Receive { get; set; }
        public NinjaSparkLineModel PaySparkLine { get; set; }
        public NinjaSparkLineModel ReceiveSparkLine { get; set; }
        public NinjaSparkLineModel LowConfidencePaySparkLine { get; set; }
        public NinjaSparkLineModel LowConfidenceReceiveSparkLine { get; set; }
        public NinjaCurrencyDetailModel Details { get; set; } // Populated in controller

    }

    public class NinjaItemLineModel
    {
        //public int Id { get; set; }
        public string Name { get; set; }
        //public string Icon { get; set; }
        public int? MapTier { get; set; }
        //public int? StackSize { get; set; }
        public int? LevelRequired { get; set; }
        //public string BaseType { get; set; }
        public int? Links { get; set; }
        public string Variant { get; set; }
        public int? ItemClass { get; set; }
        public NinjaSparkLineModel Sparkline { get; set; }
        public NinjaSparkLineModel LowConfidenceSparkline { get; set; }
        //public List<NinjaModifier> ImplicitModifiers { get; set; }
        //public List<NinjaModifier> ExplicitModifiers { get; set; }
        //public string FlavourText { get; set; }
        //public string ItemType { get; set; }
        public bool? Corrupted { get; set; }
        public int? GemLevel { get; set; }
        public int? GemQuality { get; set; }
        public double? ChaosValue { get; set; }
        //public double? ExaltedValue { get; set; }
        //public int Count { get; set; }
        //public string DetailsId { get; set; }
        //public int? ListingCount { get; set; }
        //public string MapRegion { get; set; }

        //public List<TradeInfo> TradeInfo { get; set; }
    }

    public class NinjaCurrencyLineModel
    {
        public string Name { get; set; }
        public string CurrencyTypeName { set => Name = value; }
        public string DetailsId { get; set; }
        public double ChaosEquivalent { get; set; }
        public NinjaPayReceiveModel Pay { get; set; }
        public NinjaPayReceiveModel Receive { get; set; }
        public NinjaSparkLineModel PaySparkLine { get; set; }
        public NinjaSparkLineModel ReceiveSparkLine { get; set; }
        public NinjaSparkLineModel LowConfidencePaySparkLine { get; set; }
        public NinjaSparkLineModel LowConfidenceReceiveSparkLine { get; set; }
        public NinjaCurrencyDetailModel Details { get; set; } // Populated in controller
    }

    public class TradeInfo
    {
        public string Mod { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }
        public string Option { get; set; }
    }

    

    public class NinjaModifier
    {
        public string Text { get; set; }
        public bool Optional { get; set; }
    }

    public class NinjaPayReceiveModel
    {
        public int Id { get; set; }
        public int LeagueId { get; set; }
        public int PayCurrencyOd { get; set; }
        public int GetCurrencyId { get; set; }
        public DateTime SampleTimeUtc { get; set; }
        public int Count { get; set; }
        public double Value { get; set; }
        public int DataPointCount { get; set; }
        public bool IncludesSecondary { get; set; }
        public int ListingCount { get; set; }
    }

    public class NinjaSparkLineModel
    {
        public List<double?> Data { get; set; }
        public double TotalChange { get; set; }
    }
    public class NinjaCurrencyDetailModel
    {
        public int Id { get; set; }
        public string Icon { get; set; }
        public string Name { get; set; }
        public string TradeId { get; set; }
    }

    public class NinjaResponseModel
    {
        public List<NinjaCombinedLineModel> Lines { get; set; }
        public List<NinjaCurrencyDetailModel> CurrencyDetails { get; set; }
    }
}
