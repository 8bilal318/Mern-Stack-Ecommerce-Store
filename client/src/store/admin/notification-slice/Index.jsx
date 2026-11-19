import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

// Admin: Push Notifications (bell icon) ki list laana
export const fetchNotifications = createAsyncThunk(
  "adminNotifications/fetch",
  async () => {
    const result = await axios.get(
      `${API_BASE_URL}/api/admin/notifications/get`,
      { withCredentials: true },
    );

    return result.data;
  },
);

// Admin: bell icon open karte hi saari notifications "read" mark karna
export const markNotificationsRead = createAsyncThunk(
  "adminNotifications/markRead",
  async () => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/notifications/mark-read`,
      {},
      { withCredentials: true },
    );

    return result.data;
  },
);

const AdminNotificationSlice = createSlice({
  name: "adminNotifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data?.notifications || [];
        state.unreadCount = action.payload.data?.unreadCount || 0;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
      });
  },
});

export default AdminNotificationSlice.reducer;
