using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.Models.Areas
{
    [Serializable]
    public class EventAreaModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Timestamp { get; set; }
        public List<AreaInfoModel> Info { get; set; }
    }
}
