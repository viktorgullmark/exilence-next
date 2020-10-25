using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities.Areas
{
    public class AreaInfo
    {
        public int? Act { get; set; }
        public int? Level { get; set; }
        public int? Tier { get; set; }
        public bool Town { get; set; }
        public bool Trial { get; set; }
        public bool Waypoint { get; set; }
        public List<AreaBoss> Bosses { get; set; }
    }
}
