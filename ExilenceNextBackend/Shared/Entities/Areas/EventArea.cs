using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Entities.Areas
{
    public class EventArea
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Timestamp { get; set; }
        public List<AreaInfo> Info { get; set; }
    }
}
