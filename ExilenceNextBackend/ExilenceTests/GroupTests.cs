using System;
using System.Collections.Generic;
using System.Text;
using Xunit;

namespace ExilenceTests
{
    [CollectionDefinition("NoParallelization", DisableParallelization = true)]
    public class GroupTests
    {
    }
}
