using Newtonsoft.Json;
using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class AccountModel
    {
        [JsonPropertyName("uuid")]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Token { get; set; }
        public bool Verified { get; set; }
        public Role Role { get; set; }
        public List<CharacterModel> Characters { get; set; }
        public List<SnapshotProfileModel> Profiles { get; set; }
    }
}
