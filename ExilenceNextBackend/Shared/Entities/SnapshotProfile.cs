using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class SnapshotProfile
    {
        [Required, StringLength(50)]
        public string Id { get; set; }
        public string Name { get; set; }
        public string ActiveLeagueId { get; set; }
        public string ActivePriceLeagueId { get; set; }
        public ICollection<string> ActiveStashTabIds { get; set; }
        public virtual ICollection<Snapshot> Snapshots { get; set; }
        [Required]
        public virtual Account Account { get; set; }
    }
}
