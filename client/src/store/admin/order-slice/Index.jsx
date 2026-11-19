import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

// Admin panel: saare users ke saare orders laana
export const fetchAllOrdersForAdmin = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async () => {
    const result = await axios.get(`${API_BASE_URL}/api/admin/orders/get`, {
      withCredentials: true,
    });

    return result.data;
  },
);

// Admin panel: ek order ki poori detail laana
export const fetchOrderDetailsForAdmin = createAsyncThunk(
  "adminOrders/fetchOrderDetails",
  async (id) => {
    const result = await axios.get(
      `${API_BASE_URL}/api/admin/orders/details/${id}`,
      { withCredentials: true },
    );

    return result.data;
  },
);

// Admin panel: order ka status update karna
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, orderStatus }) => {
    const result = await axios.put(
      `${API_BASE_URL}/api/admin/orders/update/${id}`,
      { orderStatus },
      { withCredentials: true },
    );

    return result.data;
  },
);

const AdminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(fetchAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(fetchOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(fetchOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // Jis order ka status update hua ho, usay list mein bhi turant refresh kar dein
        const updatedOrder = action.payload.data;
        state.orderList = state.orderList.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        );
        state.orderDetails = updatedOrder;
      });
  },
});

export const { clearOrderDetails } = AdminOrderSlice.actions;
export default AdminOrderSlice.reducer;
