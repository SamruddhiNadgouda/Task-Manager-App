import { Task } from "../types";

interface Props {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const priorityBadgeClass: Record<string, string> = {
  Low: "badge badge-priority-low",
  Medium: "badge badge-priority-medium",
  High: "badge badge-priority-high",
};

const statusLabel: Record<string, string> = {
  Todo: "Todo",
  InProgress: "In Progress",
  Done: "Done",
};

export default function TaskList({ tasks, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above.</p>;
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Priority</th>
          <th>Due</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <div className="task-title">{task.title}</div>
              {task.description && (
                <div className="task-description">{task.description}</div>
              )}
            </td>
            <td>
              <span className="badge badge-status">{statusLabel[task.status]}</span>
            </td>
            <td>
              <span className={priorityBadgeClass[task.priority]}>{task.priority}</span>
            </td>
            <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
            <td>
              <button className="btn btn-ghost" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button className="btn btn-danger-ghost" onClick={() => onDelete(task.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
