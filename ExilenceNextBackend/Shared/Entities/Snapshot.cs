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
        [Required, StringLength(50)]
        public string ClientId { get; set; }
        [Column(TypeName = "decimal")]
        public decimal TotalValue { get; set; }
        public virtual SnapshotProfile Profile { get; set; }
        public virtual ICollection<Stashtab> StashTabs { get; set; }
        public DateTime Datestamp { get; set; }

    }
}
