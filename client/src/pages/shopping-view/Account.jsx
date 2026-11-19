// import React from 'react';
// import { User, Package, MapPin, CreditCard, LogOut, Terminal, Activity } from 'lucide-react';

// const Account = () => {
//   return (
//     <div className="min-h-screen bg-zinc-950 text-white p-8 relative overflow-hidden font-sans">
//       {/* Background Decorative Glow */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />
      
//       <div className="max-w-6xl mx-auto relative">
//         {/* Header Section */}
//         <div className="mb-12 border-b border-zinc-900 pb-8">
//           {/* <div className="flex items-center gap-2 mb-2">
//             <Terminal className="h-4 w-4 text-orange-600" />
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">User Dashboard</span>
//           </div> */}
//           <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
//             My <span className="text-orange-600">Account</span>
//           </h1>
//           <p className="text-zinc-500 mt-4 font-medium uppercase tracking-wider text-sm">
//             Manage your <span className="text-zinc-300">BillaMart</span> profile and logistics.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
//           {/* Sidebar Navigation */}
//           <div className="md:col-span-1 space-y-3">
//             {[
//               { name: "Profile", icon: <User className="w-5 h-5" /> },
//               { name: "Orders", icon: <Package className="w-5 h-5" /> },
//               { name: "Addresses", icon: <MapPin className="w-5 h-5" /> },
//               { name: "Payments", icon: <CreditCard className="w-5 h-5" /> },
//             ].map((item) => (
//               <button
//                 key={item.name}
//                 className="w-full flex items-center gap-4 p-5 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all duration-300 font-black uppercase tracking-widest italic group"
//               >
//                 <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
//                 {item.name}
//               </button>
//             ))}
            
//             <button className="w-full flex items-center gap-4 p-5 mt-10 text-zinc-500 hover:text-red-500 hover:bg-red-950/20 rounded-2xl transition-all font-black uppercase tracking-widest italic border border-transparent hover:border-red-900/30">
//               <LogOut className="w-5 h-5" />
//               Sign Out
//             </button>
//           </div>

//           {/* Main Content Area */}
//           <div className="md:col-span-3">
//             <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 rounded-[32px] p-10 shadow-2xl">
//               <div className="flex items-center gap-3 mb-8">
//                  <div className="h-2 w-2 bg-orange-600 rounded-full animate-pulse" />
//                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Account Overview</h2>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[24px] group hover:border-orange-600/30 transition-colors">
//                   <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Identification</p>
//                   <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Full Name</p>
//                   <p className="font-black text-xl italic text-white uppercase tracking-tighter">Bilal Ahmed</p>
//                 </div>

//                 <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[24px] group hover:border-orange-600/30 transition-colors">
//                   <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Communication</p>
//                   <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Email Address</p>
//                   <p className="font-black text-xl italic text-white tracking-tighter truncate">bilal@billamart.com</p>
//                 </div>
//               </div>
              
//               <div className="mt-10 p-8 bg-orange-600/5 rounded-[28px] border border-orange-600/10 relative overflow-hidden group">
//                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                   <Activity className="w-20 h-20 text-orange-600" />
//                 </div>
//                 <h3 className="text-orange-600 font-black uppercase italic tracking-widest mb-3 flex items-center gap-2">
//                   <Activity className="w-4 h-4" /> Recent Activity
//                 </h3>
//                 <p className="text-zinc-400 font-medium leading-relaxed">
//                   The terminal is currently empty. Re-establish your retail connection by placing your first order.
//                 </p>
//               </div>
//             </div>

//             {/* Footer Tag */}
//             {/* <p className="mt-8 text-center text-[9px] font-black uppercase tracking-[0.6em] text-zinc-800 italic">
//               BillaMart Retail Core v3.0
//             </p> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Account;

























import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User, Package, MapPin, CreditCard, LogOut, Activity, Loader2, Download } from "lucide-react";
import { downloadReceipt } from "@/utils/downloadReceipt";
import { logoutUser } from "@/store/auth-slice/Index.jsx";
import { fetchAllOrdersByUser } from "@/store/shop/order-slice/index.js";

const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "bg-orange-600/20 text-orange-500 border border-orange-600/30";
    case "confirmed": return "bg-blue-600/20 text-blue-400 border border-blue-600/30";
    case "shipped": return "bg-purple-600/20 text-purple-400 border border-purple-600/30";
    case "delivered": return "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30";
    case "cancelled": return "bg-zinc-800 text-zinc-500 border border-zinc-700";
    default: return "bg-zinc-700 text-white";
  }
};

const Account = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, isLoading } = useSelector((state) => state.shoppingOrder);
  const [activeTab, setActiveTab] = useState("Orders");

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllOrdersByUser(user.id));
    }
  }, [dispatch, user?.id]);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <div className="mb-12 border-b border-zinc-900 pb-8">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            My <span className="text-orange-600">Account</span>
          </h1>
          <p className="text-zinc-500 mt-4 font-medium uppercase tracking-wider text-sm">
            Manage your <span className="text-zinc-300">BillaMart</span> profile and logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-3">
            {[
              { name: "Profile", icon: <User className="w-5 h-5" /> },
              { name: "Orders", icon: <Package className="w-5 h-5" /> },
              { name: "Addresses", icon: <MapPin className="w-5 h-5" /> },
              { name: "Payments", icon: <CreditCard className="w-5 h-5" /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 p-5 border rounded-2xl transition-all duration-300 font-black uppercase tracking-widest italic group ${
                  activeTab === item.name
                    ? "bg-orange-600 text-white border-orange-500"
                    : "bg-zinc-900/50 border-zinc-800/50 hover:bg-orange-600 hover:text-white hover:border-orange-500"
                }`}
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                {item.name}
              </button>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-5 mt-10 text-zinc-500 hover:text-red-500 hover:bg-red-950/20 rounded-2xl transition-all font-black uppercase tracking-widest italic border border-transparent hover:border-red-900/30"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-zinc-900 rounded-[32px] p-10 shadow-2xl">
              {activeTab === "Profile" && (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-2 w-2 bg-orange-600 rounded-full animate-pulse" />
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Account Overview</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[24px] group hover:border-orange-600/30 transition-colors">
                      <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Identification</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Role</p>
                      <p className="font-black text-xl italic text-white uppercase tracking-tighter">
                        {user?.role || "Customer"}
                      </p>
                    </div>

                    <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-[24px] group hover:border-orange-600/30 transition-colors">
                      <p className="text-orange-600 font-black uppercase text-[10px] tracking-[0.2em] mb-2">Communication</p>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">Email Address</p>
                      <p className="font-black text-xl italic text-white tracking-tighter truncate">
                        {user?.email || "Not signed in"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "Orders" && (
                <>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-2 w-2 bg-orange-600 rounded-full animate-pulse" />
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Order History</h2>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 text-zinc-500 gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                      <p className="text-xs font-black uppercase tracking-widest">Loading orders...</p>
                    </div>
                  ) : !orderList || orderList.length === 0 ? (
                    <div className="p-8 bg-orange-600/5 rounded-[28px] border border-orange-600/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-20 h-20 text-orange-600" />
                      </div>
                      <h3 className="text-orange-600 font-black uppercase italic tracking-widest mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Recent Activity
                      </h3>
                      <p className="text-zinc-400 font-medium leading-relaxed">
                        The terminal is currently empty. Re-establish your retail connection by placing your first order.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderList.map((order) => (
                        <div
                          key={order._id}
                          className="p-6 bg-zinc-950 border border-zinc-900 rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-orange-600/30 transition-colors"
                        >
                          <div>
                            <p className="font-black italic text-zinc-100 tracking-tighter">
                              #{order._id?.slice(-8)}
                            </p>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-tighter mt-1">
                              {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm ${getStatusColor(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                          <p className="font-black text-orange-500 italic tracking-tighter text-lg">
                            ${order.totalAmount}
                          </p>
                          {(order.paymentMethod === "cod" || order.paymentStatus === "paid") && (
                            <button
                              onClick={() => downloadReceipt(order._id)}
                              className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-600/40 text-orange-500 hover:bg-orange-600 hover:text-white transition-colors text-[10px] font-black uppercase tracking-tighter"
                            >
                              <Download className="w-3.5 h-3.5" /> Receipt
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {(activeTab === "Addresses" || activeTab === "Payments") && (
                <div className="p-8 bg-orange-600/5 rounded-[28px] border border-orange-600/10 text-center">
                  <p className="text-zinc-400 font-medium leading-relaxed">
                    {activeTab} management is coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;