using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public static class MiscHelper
    {
        public static string VersionFromUserAgent(string useragent)
        {

            var exilenceHeader = useragent.Split(' ').Where(s => s.Contains("exilence")).First();
            var version = exilenceHeader.Split('/').Last();
            return version;
        }
    }
}
