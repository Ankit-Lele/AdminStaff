namespace AdminStaff.Server.Models
{
    public class FamilyMember
    {
        public int FamilyMember_ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public int RelationshipId { get; set; }
       // public string Relationship { get; set; }
        public int NationalityId { get; set; }
        //public Nationality Nationality { get; set; }

        public int ID { get; set; }
    }
}
