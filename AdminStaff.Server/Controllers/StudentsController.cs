using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AdminStaff.Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Collections.Immutable;

namespace AdminStaff.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;


        public StudentsController(AppDbContext context)
        {
            _context = context;
        }



        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            // Include Nationality and FamilyMembers when fetching students
            var students = await _context.Students
          
                .ToListAsync();  // Fetch all students asynchronously
            return Ok(students);
        }

        // POST: api/Students
        [HttpPost]
        public async Task<IActionResult> PostStudent([FromBody] Student student)
        {
            // Validate required fields
            if (string.IsNullOrEmpty(student.FirstName) || string.IsNullOrEmpty(student.LastName) || student.DateOfBirth == default || student.NationalityId == 0)
            {
                return BadRequest("Missing required student details.");
            }

            // Add the student to the database
            _context.Students.Add(new Student
            {
                FirstName = student.FirstName,
                LastName = student.LastName,
                DateOfBirth = student.DateOfBirth,
                NationalityId = student.NationalityId
            });

            await _context.SaveChangesAsync();

            // Return the created student with its ID
            return CreatedAtAction(nameof(GetStudents), new { id = student.ID }, student);
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.ID)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        [HttpGet("{id}/Nationality")]
        public async Task<IActionResult> GetStudentNationality(int id)
        {
            var student = await _context.Students
                .Include(s => s.NationalityId)
                .FirstOrDefaultAsync(s => s.ID == id);

            if (student == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                student.ID,
                student.FirstName,
                student.LastName,
                student.NationalityId
            });
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPut("{id}/Nationality/{nationalityId}")]
        public async Task<IActionResult> UpdateStudentNationality(int id, int nationalityId)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            student.NationalityId = nationalityId;

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Students.Any(e => e.ID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new
            {
                student.ID,
                student.FirstName,
                student.LastName,
                student.NationalityId
            });
        }
        [HttpGet("{id}/FamilyMembers")]
        public async Task<IActionResult> GetStudentFamilyMembers(int id)
        {
            // Fetch all family members associated with the student ID
            var familyMembers = await _context.FamilyMembers
                .Where(fm => fm.ID == id)
                .Select(fm => new
                {
                    fm.ID,
                    fm.FirstName,
                    fm.LastName,
                    fm.DateOfBirth,
                    fm.RelationshipId
                })
                .ToListAsync();

            // Return 404 if no family members are found
            if (!familyMembers.Any())
            {
                return NotFound();
            }

            // Return the list of family members as an OK response
            return Ok(familyMembers);
        }
        [HttpPost("{id}/FamilyMembers")]
        public async Task<IActionResult> CreateFamilyMember(int id, FamilyMember familyMember)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            familyMember.ID = id;

            _context.FamilyMembers.Add(familyMember);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStudentFamilyMembers), new { id = familyMember.ID }, familyMember);
        }
        [HttpPut("/api/FamilyMembers/{id}")]
        public async Task<IActionResult> UpdateFamilyMember(int id, FamilyMember updatedFamilyMember)
        {
            if (id != updatedFamilyMember.ID)
            {
                return BadRequest();
            }

            _context.Entry(updatedFamilyMember).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.FamilyMembers.Any(e => e.ID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(updatedFamilyMember);
        }
        [HttpDelete("/api/FamilyMembers/{id}")]
        public async Task<IActionResult> DeleteFamilyMember(int id)
        {
            var familyMember = await _context.FamilyMembers.FindAsync(id);

            if (familyMember == null)
            {
                return NotFound();
            }

            _context.FamilyMembers.Remove(familyMember);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("/api/FamilyMembers/{id}/Nationality/{nationalityId}")]
        public async Task<IActionResult> GetFamilyMemberNationality(int id, int nationalityId)
        {
            var familyMember = await _context.FamilyMembers
                .Include(fm => fm.NationalityId)
                .FirstOrDefaultAsync(fm => fm.ID == id && fm.NationalityId == nationalityId);

            if (familyMember == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                familyMember.ID,
                familyMember.FirstName,
                familyMember.LastName,
                familyMember.DateOfBirth,
                familyMember.RelationshipId,
                familyMember.NationalityId
            });
        }
        [HttpPut("/api/FamilyMembers/{id}/Nationality/{nationalityId}")]
        public async Task<IActionResult> UpdateFamilyMemberNationality(int id, int nationalityId)
        {
            var familyMember = await _context.FamilyMembers.FindAsync(id);

            if (familyMember == null)
            {
                return NotFound();
            }

            familyMember.NationalityId = nationalityId;

            _context.Entry(familyMember).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.FamilyMembers.Any(e => e.ID == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new
            {
                familyMember.ID,
                familyMember.FirstName,
                familyMember.LastName,
                familyMember.DateOfBirth,
                familyMember.RelationshipId,
                familyMember.NationalityId
            });
        }
        [HttpGet("/api/Nationalities")]
        public async Task<IActionResult> GetAllNationalities()
        {
            var nationalities = await _context.Nationalities.ToListAsync();

            if (!nationalities.Any())
            {
                return NotFound();
            }

            return Ok(nationalities);
        }
        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.ID == id);
        }
    }
}