using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace BackgroundProcessor.Models
{
    public class TokenModel
    {
        [JsonPropertyName("token")]
        public string Token { get; set; }
    }
}
