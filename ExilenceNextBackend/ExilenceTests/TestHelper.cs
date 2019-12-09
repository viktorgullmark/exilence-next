using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace ExilenceTests
{
    public static class TestHelper
    {
        public static string GenerateUUID()
        {
            return Guid.NewGuid().ToString();
        }

        public static string GetRandomString()
        {
            string path = Path.GetRandomFileName();
            path = path.Replace(".", "");
            return path;
        }
    }
}
