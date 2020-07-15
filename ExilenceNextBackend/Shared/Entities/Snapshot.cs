using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities
{
    public class Snapshot
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string ClientId { get; set; }
        public DateTime Created { get; set; }
        [BsonIgnore]
        public List<StashTab> StashTabs { get; set; }
        public string ProfileClientId { get; set; } //stored in SQL

    }
}
