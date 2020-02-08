using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Account
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string ClientId { get; set; }
        [Required]
        public string Name { get; set; }
        public bool Verified { get; set; }
        public Role Role { get; set; }
        public virtual ICollection<Character> Characters { get; set; }
        public virtual ICollection<SnapshotProfile> Profiles { get; set; }
        public string Version { get; set; }
        public DateTime LastLogin { get; set; }
        public DateTime Created { get; set; }

        public Account()
        {
            Characters = new List<Character>();
            Profiles = new List<SnapshotProfile>();
        }
    }
}
