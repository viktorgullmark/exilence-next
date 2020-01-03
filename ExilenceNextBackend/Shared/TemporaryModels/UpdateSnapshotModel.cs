using Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.TemporaryModels
{
    public class UpdateSnapshotModel
    {
        public string ConnectionId { get; set; }
        public string ProfileId { get; set; }
        public SnapshotModel Snapshot { get; set; }
    }
}
