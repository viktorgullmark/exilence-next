using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class SnapshotModel
    {
        public int? Id { get; set; }
        public string ClientId { get; set; }
        public decimal TotalValue { get; set; }
        public virtual ICollection<StashtabModel> StashTabs { get; set; }
        public DateTime Datestamp { get; set; }
    }
}
