using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class PricedItemModel
    {
        public int? Id { get; set; }
        public string ClientId { get; set; }
        public string Name { get; set; }
        public string TypeLine { get; set; }
        public string FrameType { get; set; }
        public int? Calculated { get; set; }
        public int? Max { get; set; }
        public int? Min { get; set; }
        public int? Mean { get; set; }
        public int? Median { get; set; }
        public int? Mode { get; set; }
        public int Ilvl { get; set; }
        public bool Elder { get; set; }
        public bool Shaper { get; set; }
        public int StackSize { get; set; }
        public int TotalStackSize { get; set; }
        public int Sockets { get; set; }
        public int Links { get; set; }
        public bool Corrupted { get; set; }
        public int Tier { get; set; }
        public int Level { get; set; }
        public int Quality { get; set; }
        public string Icon { get; set; }
        public string Variant { get; set; }
    }
}
