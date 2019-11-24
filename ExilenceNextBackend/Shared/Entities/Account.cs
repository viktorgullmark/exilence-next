using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Account
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string ClientId { get; set; }
        [Required]
        public string Name { get; set; }
        public string Token { get; set; }
        public virtual ICollection<Character> Characters { get; set; }
        public virtual ICollection<SnapshotProfile> Profiles { get; set; }

        public Account()
        {

        }
    }
}
