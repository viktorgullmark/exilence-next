using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class PricedItem
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        [Required, StringLength(100)] // This is GGG's Id so it's 64 chars by default.
        public string ClientId { get; set; }
        [Required, StringLength(100)] // This is GGG's Id so it's 64 chars by default.
        public string ItemId { get; set; }
        public string Name { get; set; }
        public string TypeLine { get; set; }
        public int FrameType { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Calculated { get; set; }
        public bool Elder { get; set; }
        public bool Shaper { get; set; }
        public string Icon { get; set; }
        public int Ilvl { get; set; }
        public int Tier { get; set; }
        public bool Corrupted { get; set; }
        public int Links { get; set; }
        public int Sockets { get; set; }
        public int Quality { get; set; }
        public int Level { get; set; }
        public int StackSize { get; set; }
        public int TotalStacksize { get; set; }
        public string Variant { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Total { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Max { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Mean { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Mode { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Min { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Median { get; set; }
        public string BaseType { get; set; }
        public int Count { get; set; }

        [Required]
        public virtual Stashtab Stashtab { get; set; }
        public virtual int StashtabId { get; set; }
    }
}
