export type TaskStatus = "Todo" | "InProgress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

export interface User {
  name: string;
  email: string;
}
