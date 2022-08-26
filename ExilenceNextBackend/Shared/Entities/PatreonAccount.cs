using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Shared.Entities
{
    public class PatreonAccount
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string AccessToken { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string TokenType { get; set; }
        public string RefreshToken { get; set; }
    }
}
