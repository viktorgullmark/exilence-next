using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class PricedItem
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ClientId { get; set; } // This is GGG's Id so it's 64 chars by default.
        public string ItemId { get; set; } // This is GGG's Id so it's 64 chars by default.
        public string InventoryId { get; set; }
        public string Name { get; set; }
        public string TypeLine { get; set; }
        public int FrameType { get; set; }
        public decimal Calculated { get; set; }
        public bool Elder { get; set; }
        public bool Shaper { get; set; }
        public string Icon { get; set; }
        public int Ilvl { get; set; }
        public int Tier { get; set; }
        public bool Corrupted { get; set; }
        public int Links { get; set; }
        public int Sockets { get; set; }
        public int Quality { get; set; }
        public int Level { get; set; }
        public int StackSize { get; set; }
        public int TotalStacksize { get; set; }
        public string Variant { get; set; }
        public decimal Total { get; set; }
        public decimal Max { get; set; }
        public decimal Mean { get; set; }
        public decimal Mode { get; set; }
        public decimal Min { get; set; }
        public decimal Median { get; set; }
        public string BaseType { get; set; }
        public int Count { get; set; }

        public  string StashtabClientId { get; set; }
        public string SnapshotProfileClientId { get; set; } //For easy deletion
    }
}
