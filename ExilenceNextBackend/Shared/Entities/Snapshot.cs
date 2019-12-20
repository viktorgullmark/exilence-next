using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Snapshot
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(100)] // This is GGG's Id so it's 64 chars by default.
        public string ClientId { get; set; }
        public DateTime Datestamp { get; set; }
        public virtual ICollection<Stashtab> StashTabs { get; set; }
        [Required]
        public virtual SnapshotProfile Profile { get; set; }

    }
}
