import { useState, FormEvent, useEffect } from "react";
import { Task, TaskInput, TaskStatus, TaskPriority } from "../types";

interface Props {
  initial?: Task | null;
  onSubmit: (input: TaskInput) => void;
  onCancel?: () => void;
}

export default function TaskForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description || "");
      setStatus(initial.status);
      setPriority(initial.priority);
      setDueDate(initial.dueDate ? initial.dueDate.slice(0, 10) : "");
    }
  }, [initial]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });
    if (!initial) {
      setTitle("");
      setDescription("");
      setStatus("Todo");
      setPriority("Medium");
      setDueDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="task-form-row">
        <div className="form-group grow">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group grow">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            className="input"
            placeholder="Optional details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group fixed">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="form-group fixed">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group fixed">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            className="input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group fixed">
          <label>&nbsp;</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="submit" className="btn btn-primary">
              {initial ? "Save" : "Add Task"}
            </button>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
