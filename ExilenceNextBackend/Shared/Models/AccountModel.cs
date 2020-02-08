
using MessagePack;
using Shared.Enums;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    [MessagePackObject]
    public class AccountModel
    {
        [JsonIgnore]
        [IgnoreMember]
        public int? Id { get; set; }
        [Key("uuid")]
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        [Key("name")]
        public string Name { get; set; }
        [Key("accessToken")]
        public string AccessToken { get; set; }
        [Key("verified")]
        public bool Verified { get; set; }
        [Key("role")]
        public Role Role { get; set; }
        [Key("characters")]
        public List<CharacterModel> Characters { get; set; }
        [Key("profiles")]
        public List<SnapshotProfileModel> Profiles { get; set; }
        [IgnoreMember]
        public string Version { get; set; }
    }
}
