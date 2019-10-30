using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Connection
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string ConnectionId { get; set; }
        public DateTime Created { get; set; }

        public Connection(string connectionId)
        {
            ConnectionId = connectionId;
            Created = DateTime.UtcNow;
        }
    }
}
