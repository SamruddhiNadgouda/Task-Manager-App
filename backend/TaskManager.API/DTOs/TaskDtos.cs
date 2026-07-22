using TaskManager.API.Models;

namespace TaskManager.API.DTOs;

public record TaskCreateRequest(
    string Title,
    string? Description,
    TaskItemStatus Status,
    TaskPriority Priority,
    DateTime? DueDate
);

public record TaskUpdateRequest(
    string Title,
    string? Description,
    TaskItemStatus Status,
    TaskPriority Priority,
    DateTime? DueDate
);

public record TaskResponse(
    int Id,
    string Title,
    string? Description,
    string Status,
    string Priority,
    DateTime? DueDate,
    DateTime CreatedAt,
    DateTime UpdatedAt
);
