using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace API.Models.Ninja
{
    public class NinjaCurrencyLineModel
    {
        public string CurrencyTypeName { get; set; }
        public string DetailsId { get; set; }
        public double ChaosEquivalent { get; set; }
        public NinjaPayReceiveModel Pay { get; set; }
        public NinjaPayReceiveModel Receive { get; set; }
        public NinjaSparkLineModel PaySparkLine { get; set; }
        public NinjaSparkLineModel ReceiveSparkLine { get; set; }
        public NinjaSparkLineModel LowConfidencePaySparkLine { get; set; }
        public NinjaSparkLineModel LowConfidenceReceiveSparkLine { get; set; }
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
        public int TotalChange { get; set; }
    }
}
