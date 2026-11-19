// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./auth-slice";
// import AdminProductsSlice from "./admin/product-slice"
// import ShopProductSlice from "./shop/product-slice" 
// import shopCartSlice from "./shop/cart-slice/index.js"
// import shopOrderSlice from "./shop/order-slice/index.js"

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     adminProducts: AdminProductsSlice,
//     shopProducts: ShopProductSlice,
//     cart: shopCartSlice,
//     shoppingOrder: shopOrderSlice,


//   },
// });












// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./auth-slice/Index.jsx";
// import AdminProductsSlice from "./admin/product-slice/Index.jsx"
// import AdminOrderSlice from "./admin/order-slice/Index.jsx"
// import ShopProductSlice from "./shop/product-slice" 
// import shopCartSlice from "./shop/cart-slice/index.js"
// import shopOrderSlice from "./shop/order-slice/index.js"

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     adminProducts: AdminProductsSlice,
//     adminOrders: AdminOrderSlice,
//     shopProducts: ShopProductSlice,
//     cart: shopCartSlice,
//     shoppingOrder: shopOrderSlice,


//   },
// });





















// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./auth-slice/Index.jsx";
// import AdminProductsSlice from "./admin/product-slice/Index.jsx"
// import AdminOrderSlice from "./admin/order-slice/Index.jsx"
// import AdminDashboardSlice from "./admin/dashboard-slice/Index.jsx"
// import AdminSettingsSlice from "./admin/settings-slice/Index.jsx"
// import ShopProductSlice from "./shop/product-slice" 
// import shopCartSlice from "./shop/cart-slice/index.js"
// import shopOrderSlice from "./shop/order-slice/index.js"
// import shopSettingsSlice from "./shop/settings-slice/index.js"

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     adminProducts: AdminProductsSlice,
//     adminOrders: AdminOrderSlice,
//     adminDashboard: AdminDashboardSlice,
//     adminSettings: AdminSettingsSlice,
//     shopProducts: ShopProductSlice,
//     cart: shopCartSlice,
//     shoppingOrder: shopOrderSlice,
//     shopSettings: shopSettingsSlice,


//   },
// });



















import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/Index.jsx";
import AdminProductsSlice from "./admin/product-slice/Index.jsx"
import AdminOrderSlice from "./admin/order-slice/Index.jsx"
import AdminDashboardSlice from "./admin/dashboard-slice/Index.jsx"
import AdminSettingsSlice from "./admin/settings-slice/Index.jsx"
import AdminNotificationSlice from "./admin/notification-slice/Index.jsx"
import ShopProductSlice from "./shop/product-slice" 
import shopCartSlice from "./shop/cart-slice/index.js"
import shopOrderSlice from "./shop/order-slice/index.js"
import shopSettingsSlice from "./shop/settings-slice/index.js"
import shopSearchSlice from "./shop/search-slice/index.jsx"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProducts: AdminProductsSlice,
    adminOrders: AdminOrderSlice,
    adminDashboard: AdminDashboardSlice,
    adminSettings: AdminSettingsSlice,
    adminNotifications: AdminNotificationSlice,
    shopProducts: ShopProductSlice,
    cart: shopCartSlice,
    shoppingOrder: shopOrderSlice,
    shopSettings: shopSettingsSlice,
    shopSearch: shopSearchSlice,


  },
});