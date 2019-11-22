using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models
{
    public class StashtabModel
    {
        public int? Id { get; set; }
        public string ClientId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        public virtual ICollection<PricedItemModel> PricedItems { get; set; }
    }
}
