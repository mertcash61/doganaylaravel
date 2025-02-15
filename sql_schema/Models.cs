using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataPackets.Models
{
    public class User
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string Email { get; set; }

        [Required]
        [MaxLength(255)]
        public string Password { get; set; }

        [MaxLength(100)]
        public string RememberToken { get; set; }

        public DateTime? EmailVerifiedAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public virtual Profile Profile { get; set; }
    }

    public class Profile
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; }

        [MaxLength(255)]
        public string Avatar { get; set; }

        public string Bio { get; set; }

        [MaxLength(20)]
        public string Phone { get; set; }

        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }
    }
} 