using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Group
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public virtual ICollection<Connection> Connections { get; set; }
        public DateTime Created { get; set; }


        public Group()
        {

        }

        public Group(string code, ICollection<Connection> connections)
        {
            Name = code;
            Connections = connections;
            Created = DateTime.UtcNow;
        }

    }
}
