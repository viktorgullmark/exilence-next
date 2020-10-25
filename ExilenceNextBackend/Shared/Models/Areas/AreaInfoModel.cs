using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models.Areas
{
    [Serializable]
    public class AreaInfoModel
    {
        public int? Act { get; set; }
        public int? Level { get; set; }
        public int? Tier { get; set; }
        public bool Town { get; set; }
        public bool Trial { get; set; }
        public bool Waypoint { get; set; }
        public List<AreaBossModel> Bosses { get; set; }
    }
}
