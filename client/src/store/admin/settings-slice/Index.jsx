import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  settings: null,
  isLoading: false,
};

// Admin: features + popup dono ki settings laana
export const fetchAdminSettings = createAsyncThunk(
  "adminSettings/fetchSettings",
  async () => {
    const result = await axios.get(`${API_BASE_URL}/api/admin/settings/get`, {
      withCredentials: true,
    });

    return result.data;
  },
);

// Admin: feature toggles (Storefront, Inventory, Payments, etc.) update karna
export const updateFeatures = createAsyncThunk(
  "adminSettings/updateFeatures",
  async (features) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/settings/features`,
      { features },
      { withCredentials: true },
    );

    return result.data;
  },
);

// Admin: homepage popup config update karna
export const updatePopup = createAsyncThunk(
  "adminSettings/updatePopup",
  async (popup) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/settings/popup`,
      { popup },
      { withCredentials: true },
    );

    return result.data;
  },
);

const AdminSettingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload.data;
      })
      .addCase(fetchAdminSettings.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateFeatures.fulfilled, (state, action) => {
        state.settings = action.payload.data;
      })
      .addCase(updatePopup.fulfilled, (state, action) => {
        state.settings = action.payload.data;
      });
  },
});

export default AdminSettingsSlice.reducer;
