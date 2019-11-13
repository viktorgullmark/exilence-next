﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class AccountModel
    {
        public int? Id { get; set; }
        [JsonProperty("uuid")]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public List<CharacterModel> Characters { get; set; }
    }
}
