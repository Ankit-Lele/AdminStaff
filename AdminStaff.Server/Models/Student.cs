namespace AdminStaff.Server.Models
{
    public class Student
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int? NationalityID { get; set; }

        // Navigation property
        public Nationality Nationality { get; set; }
        public ICollection<FamilyMember> FamilyMembers { get; set; }
    }

}
