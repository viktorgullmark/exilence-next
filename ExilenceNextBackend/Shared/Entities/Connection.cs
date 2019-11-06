using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Connection
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(100)]
        public string ConnectionId { get; set; }
        [Required, StringLength(20)]
        public string InstanceName { get; set; }
        [Required, StringLength(20)]
        public DateTime Created { get; set; }


        public Connection(string connectionId, string instanceName)
        {
            ConnectionId = connectionId;
            InstanceName = instanceName;
            Created = DateTime.UtcNow;
        }
    }
}
