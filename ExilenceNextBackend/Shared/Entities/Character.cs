using Shared.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Character
    {
 
        [Key, Required, StringLength(50)]
        public string Id { get; set; }
        public string Name { get; set; }
        public  virtual League League { get; set; }
        public Class Class { get; set; }
        public Ascendancy Ascendancy{ get; set; }
        public int Level { get; set; }
        [Required]
        public virtual Account Account { get; set; }

        public Character()
        {

        }
    }
}
