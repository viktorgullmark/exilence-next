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
        [JsonPropertyName("uuid")]
        public string Id { get; set; }
        public List<StashtabModel> StashTabs { get; set; }
        public DateTime Datestamp { get; set; }
    }
}
