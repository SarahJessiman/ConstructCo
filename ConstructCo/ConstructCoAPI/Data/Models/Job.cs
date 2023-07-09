using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Linq;


namespace ConstructCoAPI.Data.Models
{
    [Table("Jobs")]
    [Index(nameof(Description), IsUnique = true)]
    public class Job
    {
        [Key]
        public int JobId { get; set; }

        [Required, MinLength(15), MaxLength(50), Column(TypeName = ("nvarchar"))]
        public string Description { get; set; }

        [Required, Column(TypeName = ("decimal(5,2)"))]
        public decimal HourCharge { get; set; }

        [Required, Column(TypeName = ("datetime2"))]
        public DateTime LastUpdated { get; set; }

    }//End class Job
}//End class backend.Data.Models
