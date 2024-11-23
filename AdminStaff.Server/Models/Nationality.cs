namespace AdminStaff.Server.Models
{
    public class Nationality
    {
        public int ID { get; set; }
        public string Name { get; set; }

        // Navigation properties
        //public ICollection<Student> Students { get; set; }
        //public ICollection<FamilyMember> FamilyMembers { get; set; }
    }
}
