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
        public string ClientId { get; set; }
        public string ItemId { get; set; } // This is GGG's Id so it's 64 chars by default.
        public string DetailsId { get; set; }
        public double Calculated { get; set; }
        public int StackSize { get; set; }

        public  string StashtabClientId { get; set; }
        public string SnapshotProfileClientId { get; set; } //For easy deletion
    }
}
