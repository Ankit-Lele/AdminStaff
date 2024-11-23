namespace AdminStaff.Server.Models
{
    public class FamilyMember
    {
        public int ID { get; set; }
        public int StudentID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int RelationshipID { get; set; }
        public int? NationalityID { get; set; }

        // Navigation properties
        public Student Student { get; set; }
        public Relationship Relationship { get; set; }
        public Nationality Nationality { get; set; }
    }
}
