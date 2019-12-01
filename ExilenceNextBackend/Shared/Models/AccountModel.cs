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
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public string Token { get; set; }
        public bool Verified { get; set; }
        public Role Role { get; set; }
        public List<CharacterModel> Characters { get; set; }
    }
}
