using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class Stashtab
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, StringLength(50)]
        public string ClientId { get; set; }
        public string Name { get; set; }
        public int Index { get; set; }
        public string Color { get; set; }
        public virtual ICollection<PricedItem> PricedItems { get; set; }

    }
}
