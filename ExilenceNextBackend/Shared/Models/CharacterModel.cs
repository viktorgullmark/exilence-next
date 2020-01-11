using Shared.Enums;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class CharacterModel
    {
        [JsonIgnore]
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public virtual LeagueModel League { get; set; }
        public Class Class { get; set; }
        public Ascendancy Ascendancy { get; set; }
        public int Level { get; set; }
    }
}
