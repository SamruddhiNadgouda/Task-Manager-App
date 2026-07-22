using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskManager.API.Data;
using TaskManager.API.DTOs;
using TaskManager.API.Models;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    private int CurrentUserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);

    private static TaskResponse ToResponse(TaskItem t) => new(
        t.Id, t.Title, t.Description, t.Status.ToString(), t.Priority.ToString(),
        t.DueDate, t.CreatedAt, t.UpdatedAt
    );

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetAll()
    {
        var tasks = await _db.Tasks
            .Where(t => t.UserId == CurrentUserId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return Ok(tasks.Select(ToResponse));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TaskResponse>> GetById(int id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (task is null) return NotFound();
        return Ok(ToResponse(task));
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create(TaskCreateRequest req)
    {
        var task = new TaskItem
        {
            Title = req.Title,
            Description = req.Description,
            Status = req.Status,
            Priority = req.Priority,
            DueDate = req.DueDate.HasValue
                ? DateTime.SpecifyKind(req.DueDate.Value, DateTimeKind.Utc)
                : null,
            UserId = CurrentUserId
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, ToResponse(task));
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TaskResponse>> Update(int id, TaskUpdateRequest req)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (task is null) return NotFound();

        task.Title = req.Title;
        task.Description = req.Description;
        task.Status = req.Status;
        task.Priority = req.Priority;
        task.DueDate = req.DueDate.HasValue
            ? DateTime.SpecifyKind(req.DueDate.Value, DateTimeKind.Utc)
            : null;
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ToResponse(task));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == CurrentUserId);
        if (task is null) return NotFound();

        _db.Tasks.Remove(task);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
