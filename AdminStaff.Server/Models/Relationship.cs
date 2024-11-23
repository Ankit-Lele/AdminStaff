namespace AdminStaff.Server.Models
{
    public class Relationship
    {
        public int ID { get; set; }
        public string Name { get; set; }

        // Navigation property
       // public ICollection<FamilyMember> FamilyMembers { get; set; }
    }
}
