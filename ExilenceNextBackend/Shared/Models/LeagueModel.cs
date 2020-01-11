using System;
using System.Collections.Generic;
using System.Text;

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
