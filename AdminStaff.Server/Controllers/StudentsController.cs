using AdminStaff.Server.Models;
using AdminStaff.Server;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StudentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _context.Students.Include(s => s.Nationality).ToListAsync();
        return Ok(students);
    }

    [HttpPost]
    public async Task<IActionResult> AddStudent([FromBody] Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllStudents), new { id = student.ID }, student);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student updatedStudent)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();

        student.FirstName = updatedStudent.FirstName;
        student.LastName = updatedStudent.LastName;
        student.DateOfBirth = updatedStudent.DateOfBirth;
        student.NationalityID = updatedStudent.NationalityID;

        await _context.SaveChangesAsync();
        return Ok(student);
    }
}