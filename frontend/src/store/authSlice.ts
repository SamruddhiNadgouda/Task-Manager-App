import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { AuthResponse, User } from "../types";

// store.ts creates the central storage.
// Each slice manages one section of that storage.
// Components use useSelector() to read data from the store.
// Components use dispatch() to update data in the store.
interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
  message: string | null;
}

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  status: "idle",
  error: null,
  message: null,
};
// createAsyncThunk is a Redux Toolkit function that simplifies the process of creating asynchronous actions. 
// It automatically generates action types and action creators for pending, fulfilled, and rejected states of an async operation.
export const login = createAsyncThunk(
  "auth/login",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosClient.post<AuthResponse>("/auth/register", payload);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload: { email: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<{ message: string }>(
        "/auth/forgot-password",
        payload
      );
      return data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post<{ message: string }>(
        "/auth/reset-password",
        payload
      );
      return data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthMessage(state) {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.user = { name: action.payload.name, email: action.payload.email };
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.status = "idle";
        state.token = action.payload.token;
        state.user = { name: action.payload.name, email: action.payload.email };
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "idle";
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
