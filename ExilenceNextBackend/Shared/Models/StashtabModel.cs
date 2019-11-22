﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Shared.Models
{
    public class StashtabModel
    {
        public int? Id { get; set; }
        [JsonPropertyName("uuid")]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        public virtual ICollection<PricedItemModel> PricedItems { get; set; }
    }
}
