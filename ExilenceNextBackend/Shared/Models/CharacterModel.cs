﻿using Newtonsoft.Json;
using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class CharacterModel
    {
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
