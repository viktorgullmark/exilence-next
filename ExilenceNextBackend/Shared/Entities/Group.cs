using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Group
    {

        [Key, Required, StringLength(50)]
        public string Id { get; set; }
        [Required]
        public string Name { get; set; }
        public virtual ICollection<Connection> Connections { get; set; }
        public DateTime Created { get; set; }

        public Group(){}

        public Group(string code, ICollection<Connection> connections)
        {
            Name = code;
            Id = new Guid().ToString();
            Connections = connections;
            Created = DateTime.UtcNow;
        }

    }
}
