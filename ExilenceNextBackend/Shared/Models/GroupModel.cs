using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class GroupModel
    {
        [JsonPropertyName("uuid")]
        public string Id { get; set; }
        public string Name { get; set; }
        public List<ConnectionModel> Connections { get; set; }
        public DateTime Created { get; set; }
    }
}
