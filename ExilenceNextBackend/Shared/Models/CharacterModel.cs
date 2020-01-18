using MessagePack;
using Shared.Enums;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class CharacterModel
    {
        [IgnoreMember]
        public int? Id { get; set; }
        [Key("uuid")]
        public string ClientId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("league")]
        public virtual LeagueModel League { get; set; }
        [Key("class")]
        public Class Class { get; set; }
        [Key("ascendancy")]
        public Ascendancy Ascendancy { get; set; }
        [Key("level")]
        public int Level { get; set; }
    }
}
