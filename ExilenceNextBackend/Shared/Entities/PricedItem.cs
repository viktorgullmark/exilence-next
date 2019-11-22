﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class PricedItem
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public string TypeLine { get; set; }
        public string FrameType { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Calculated { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Max { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Min { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Mean { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Median { get; set; }
        [Column(TypeName = "decimal")]
        public decimal? Mode { get; set; }
        [Column(TypeName = "decimal")]
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
