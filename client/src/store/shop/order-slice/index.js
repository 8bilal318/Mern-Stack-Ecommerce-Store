// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const initialState = {
//   isLoading: false,
// };

// export const createCheckoutSession = createAsyncThunk(
//   "order/createCheckoutSession",
//   async ({ userId, cartItems, addressInfo, totalAmount }) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/order/create-checkout-session`,
//       { userId, cartItems, addressInfo, totalAmount },
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// export const createCodOrder = createAsyncThunk(
//   "order/createCodOrder",
//   async (orderData) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/order/create`,
//       orderData,
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// const orderSlice = createSlice({
//   name: "shoppingOrder",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCheckoutSession.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCheckoutSession.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCheckoutSession.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCodOrder.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.rejected, (state) => {
//         state.isLoading = false;
//       });
//   },
// });

// export default orderSlice.reducer;







































// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const initialState = {
//   isLoading: false,
//   orderList: [],
// };

// export const createCheckoutSession = createAsyncThunk(
//   "order/createCheckoutSession",
//   async ({ userId, cartItems, addressInfo, totalAmount }) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/order/create-checkout-session`,
//       { userId, cartItems, addressInfo, totalAmount },
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// export const createCodOrder = createAsyncThunk(
//   "order/createCodOrder",
//   async (orderData) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/order/create`,
//       orderData,
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// // Logged-in user ke saare orders (My Orders / Account page) laane ke liye
// export const fetchAllOrdersByUser = createAsyncThunk(
//   "order/fetchAllOrdersByUser",
//   async (userId) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/api/shop/order/list/${userId}`,
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// const orderSlice = createSlice({
//   name: "shoppingOrder",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCheckoutSession.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCheckoutSession.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCheckoutSession.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCodOrder.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(fetchAllOrdersByUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllOrdersByUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderList = action.payload.data;
//       })
//       .addCase(fetchAllOrdersByUser.rejected, (state) => {
//         state.isLoading = false;
//         state.orderList = [];
//       });
//   },
// });

// export default orderSlice.reducer;















// import axios from "axios";
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const initialState = {
//   isLoading: false,
//   orderList: [],
// };

// export const createCheckoutSession = createAsyncThunk(
//   "order/createCheckoutSession",
//   async ({ userId, cartItems, addressInfo, totalAmount }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/shop/order/create-checkout-session`,
//         { userId, cartItems, addressInfo, totalAmount },
//         { withCredentials: true }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || { message: "Could not start payment." }
//       );
//     }
//   }
// );

// export const createCodOrder = createAsyncThunk(
//   "order/createCodOrder",
//   async (orderData) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/api/shop/order/create`,
//       orderData,
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// // Logged-in user ke saare orders (My Orders / Account page) laane ke liye
// export const fetchAllOrdersByUser = createAsyncThunk(
//   "order/fetchAllOrdersByUser",
//   async (userId) => {
//     const response = await axios.get(
//       `${API_BASE_URL}/api/shop/order/list/${userId}`,
//       { withCredentials: true }
//     );
//     return response.data;
//   }
// );

// const orderSlice = createSlice({
//   name: "shoppingOrder",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createCheckoutSession.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCheckoutSession.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCheckoutSession.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(createCodOrder.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(createCodOrder.rejected, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(fetchAllOrdersByUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchAllOrdersByUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.orderList = action.payload.data;
//       })
//       .addCase(fetchAllOrdersByUser.rejected, (state) => {
//         state.isLoading = false;
//         state.orderList = [];
//       });
//   },
// });

// export default orderSlice.reducer;







































import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  isLoading: false,
  orderList: [],
};

export const createCheckoutSession = createAsyncThunk(
  "order/createCheckoutSession",
  async ({ userId, cartItems, addressInfo, totalAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shop/order/create-checkout-session`,
        { userId, cartItems, addressInfo, totalAmount },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Could not start payment." }
      );
    }
  }
);

export const createCodOrder = createAsyncThunk(
  "order/createCodOrder",
  async (orderData) => {
    const response = await axios.post(
      `${API_BASE_URL}/api/shop/order/create`,
      orderData,
      { withCredentials: true }
    );
    return response.data;
  }
);

// Logged-in user ke saare orders (My Orders / Account page) laane ke liye
export const fetchAllOrdersByUser = createAsyncThunk(
  "order/fetchAllOrdersByUser",
  async (userId) => {
    const response = await axios.get(
      `${API_BASE_URL}/api/shop/order/list/${userId}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCheckoutSession.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createCodOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCodOrder.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCodOrder.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(fetchAllOrdersByUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      });
  },
});

export default orderSlice.reducer;
