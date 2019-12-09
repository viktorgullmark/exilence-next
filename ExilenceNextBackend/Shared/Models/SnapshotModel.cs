using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class SnapshotModel
    {
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public decimal TotalValue { get; set; }
        public List<StashtabModel> StashTabs { get; set; }
        public SnapshotProfileModel Profile { get; set; }
        public DateTime Datestamp { get; set; }
    }
}
