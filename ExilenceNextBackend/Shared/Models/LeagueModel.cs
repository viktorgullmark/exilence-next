using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class LeagueModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        public int? ClientId { get; set; }
        public string Name { get; set; }
    }
}
