import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../services/axiosInstance";

// Thunk to handle like toggle
export const toggleLike = createAsyncThunk(
  "video/toggleLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`likes/toggle/v/${videoId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const videoSlice = createSlice({
  name: "video",
  initialState: {
    isLiked: false,
    likes: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // Reducer for setting initial state if necessary
    setVideoData: (state, action) => {
      state.isLiked = action.payload.isLiked;
      state.likes = action.payload.likes;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.loading = false;
        state.isLiked = !state.isLiked;
        state.likes = state.isLiked ? state.likes + 1 : state.likes - 1;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setVideoData } = videoSlice.actions;
export default videoSlice.reducer;
