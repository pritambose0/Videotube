import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

const initialState = {
  status: false,
  userData: null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/register", userData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/login", data);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        (state.loading = true), (state.error = null), (state.status = false);
      })
      .addCase(register.fulfilled, (state, action) => {
        (state.loading = false),
          (state.userData = action.payload),
          (state.status = true);
      })
      .addCase(register.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload),
          (state.status = false);
      })
      .addCase(login.pending, (state) => {
        (state.loading = true), (state.error = null), (state.status = false);
      })
      .addCase(login.fulfilled, (state, action) => {
        (state.loading = false),
          (state.userData = action.payload),
          (state.status = true);
      })
      .addCase(login.rejected, (state, action) => {
        (state.loading = false),
          (state.error = action.payload),
          (state.status = false);
        state.userData = null;
      });
  },
});

// export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
