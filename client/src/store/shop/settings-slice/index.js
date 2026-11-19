// // import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// // import axios from "axios";

// // const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// // const initialState = {
// //   popup: null,
// //   isLoading: false,
// // };

// // // Storefront: homepage popup config laana (public route, login zaroori nahi)
// // export const fetchPublicSettings = createAsyncThunk(
// //   "shopSettings/fetchPublicSettings",
// //   async () => {
// //     const result = await axios.get(`${API_BASE_URL}/api/shop/settings/get`);

// //     return result.data;
// //   },
// // );

// // const ShopSettingsSlice = createSlice({
// //   name: "shopSettings",
// //   initialState,
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchPublicSettings.pending, (state) => {
// //         state.isLoading = true;
// //       })
// //       .addCase(fetchPublicSettings.fulfilled, (state, action) => {
// //         state.isLoading = false;
// //         state.popup = action.payload.data?.popup || null;
// //       })
// //       .addCase(fetchPublicSettings.rejected, (state) => {
// //         state.isLoading = false;
// //         state.popup = null;
// //       });
// //   },
// // });

// // export default ShopSettingsSlice.reducer;



















// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const initialState = {
//   popup: null,
//   storefront: true,
//   payments: true,
//   isLoading: false,
//   isLoaded: false,
// };

// // Storefront: homepage popup config laana (public route, login zaroori nahi)
// export const fetchPublicSettings = createAsyncThunk(
//   "shopSettings/fetchPublicSettings",
//   async () => {
//     const result = await axios.get(`${API_BASE_URL}/api/shop/settings/get`);

//     return result.data;
//   },
// );

// const ShopSettingsSlice = createSlice({
//   name: "shopSettings",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPublicSettings.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchPublicSettings.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isLoaded = true;
//         state.popup = action.payload.data?.popup || null;
//         state.storefront = action.payload.data?.storefront ?? true;
//         state.payments = action.payload.data?.payments ?? true;
//       })
//       .addCase(fetchPublicSettings.rejected, (state) => {
//         state.isLoading = false;
//         state.isLoaded = true;
//         state.popup = null;
//       });
//   },
// });

// export default ShopSettingsSlice.reducer;






















import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialState = {
  popup: null,
  storefront: true,
  payments: true,
  shipping: true,
  isLoading: false,
  isLoaded: false,
};

// Storefront: homepage popup config laana (public route, login zaroori nahi)
export const fetchPublicSettings = createAsyncThunk(
  "shopSettings/fetchPublicSettings",
  async () => {
    const result = await axios.get(`${API_BASE_URL}/api/shop/settings/get`);

    return result.data;
  },
);

const ShopSettingsSlice = createSlice({
  name: "shopSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSettings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublicSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.popup = action.payload.data?.popup || null;
        state.storefront = action.payload.data?.storefront ?? true;
        state.payments = action.payload.data?.payments ?? true;
        state.shipping = action.payload.data?.shipping ?? true;
      })
      .addCase(fetchPublicSettings.rejected, (state) => {
        state.isLoading = false;
        state.isLoaded = true;
        state.popup = null;
      });
  },
});

export default ShopSettingsSlice.reducer;
