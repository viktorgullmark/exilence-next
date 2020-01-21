using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.TemporaryModels
{
    public class UpdatePricedItemsModel
    {
        public string ConnectionId { get; set; }
        public string ProfileId { get; set; }
        public string SnapshotId { get; set; }
        public string StashTabId { get; set; }
        public List<PricedItemModel> PricedItems { get; set; }
    }
}
