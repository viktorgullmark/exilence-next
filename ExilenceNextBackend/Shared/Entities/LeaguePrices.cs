using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities
{
    public class LeaguePrices
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string League { get; set; }
        public string Type { get; set; }
        public string Language { get; set; }

    }
}
