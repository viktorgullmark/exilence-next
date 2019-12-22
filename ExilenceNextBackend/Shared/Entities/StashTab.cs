using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Stashtab
    {
        [Key, Required, StringLength(100)] // This is GGG's Id so it's 64 chars by default.
        public string Id { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        [Column(TypeName = "decimal(13,4)")]
        public decimal Value { get; set; }
        public virtual ICollection<PricedItem> PricedItems { get; set; }
        [Required]
        public virtual Snapshot Snapshot { get; set; }

    }
}
