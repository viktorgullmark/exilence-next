using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.ApiModels
{
    public class ProfileEndpointModel
    {
            public string Name { get; set; }
            public string Realm { get; set; }
            public string Avatar_url { get; set; }        
    }
}
