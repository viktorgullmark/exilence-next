using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Connection
    {

        [Key, Required, StringLength(100)]
        public string Id { get; set; }
        [Required, StringLength(20)]
        public string InstanceName { get; set; }
        [Required, StringLength(20)]
        public DateTime Created { get; set; }
        public virtual Account Account { get; set; }

        public Connection()
        {
        }
    }
}
