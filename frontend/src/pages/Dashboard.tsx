import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTasks, createTask, updateTask, deleteTask } from "../store/tasksSlice";
import { logout } from "../store/authSlice";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { Task, TaskInput } from "../types";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, status } = useAppSelector((state) => state.tasks);
  const user = useAppSelector((state) => state.auth.user);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateOrUpdate = (input: TaskInput) => {
    if (editingTask) {
      dispatch(updateTask({ id: editingTask.id, payload: input }));
      setEditingTask(null);
    } else {
      dispatch(createTask(input));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="topbar">
        <div>
          <h2>Your tasks</h2>
          {user?.name && <p className="topbar-user">Welcome back, {user.name}</p>}
        </div>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="card">
        <TaskForm
          initial={editingTask}
          onSubmit={handleCreateOrUpdate}
          onCancel={editingTask ? () => setEditingTask(null) : undefined}
        />
      </div>

      <div className="card">
        {status === "loading" ? (
          <p className="empty-state">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={items}
            onEdit={setEditingTask}
            onDelete={(id) => dispatch(deleteTask(id))}
          />
        )}
      </div>
    </div>
  );
}
