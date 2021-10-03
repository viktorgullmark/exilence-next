using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities
{
    public class CacheValue
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public string Key { get; set; }

        [BsonRepresentation(BsonType.String)]
        public string Value { get; set; }

        [BsonRequired]
        [BsonElement("expiry")]
        public DateTime ExpireAt { get; set; }

    }
}
