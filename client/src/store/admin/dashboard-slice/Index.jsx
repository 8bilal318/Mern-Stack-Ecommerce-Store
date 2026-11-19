import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  stats: null,
  isLoading: false,
};

// Admin dashboard: live stats (revenue, orders, products, customers, recent activity)
export const fetchDashboardStats = createAsyncThunk(
  "adminDashboard/fetchStats",
  async () => {
    const result = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      withCredentials: true,
    });

    return result.data;
  },
);

const AdminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.isLoading = false;
        state.stats = null;
      });
  },
});

export default AdminDashboardSlice.reducer;
