import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { Task, TaskInput } from "../types";

interface TasksState {
  items: Task[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchTasks = createAsyncThunk("tasks/fetchAll", async () => {
  const { data } = await axiosClient.get<Task[]>("/tasks");
  return data;
});

export const createTask = createAsyncThunk(
  "tasks/create",
  async (payload: TaskInput) => {
    const { data } = await axiosClient.post<Task>("/tasks", payload);
    return data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, payload }: { id: number; payload: TaskInput }) => {
    const { data } = await axiosClient.put<Task>(`/tasks/${id}`, payload);
    return data;
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id: number) => {
  await axiosClient.delete(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.status = "idle";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load tasks";
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
