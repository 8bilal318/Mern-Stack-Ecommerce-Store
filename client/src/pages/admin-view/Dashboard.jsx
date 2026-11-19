// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Package, ShoppingCart, Users, TrendingUp, Zap } from "lucide-react";

// const Dashboard = () => {
//   // Mock Data - BillaMart Theme Integrated
//   const stats = [
//     { title: "Total Revenue", value: "$45,231.89", icon: TrendingUp, color: "text-orange-500", trend: "+12.5%" },
//     { title: "Active Orders", value: "124", icon: ShoppingCart, color: "text-orange-600", trend: "High Demand" },
//     { title: "Total Products", value: "842", icon: Package, color: "text-orange-500", trend: "In Stock" },
//     { title: "Total Customers", value: "1,203", icon: Users, color: "text-orange-600", trend: "Elite Members" },
//   ];

//   return (
//     <div className="p-8 space-y-10 bg-zinc-950 min-h-screen text-white font-sans relative overflow-hidden">
//       {/* Background Decorative Element */}
//       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />

//       {/* Page Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-8">
//         <div>
//           <div className="flex items-center gap-2 mb-2">
//             <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">System Live</span>
//           </div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic">
//             Executive <span className="text-orange-600">Dashboard</span>
//           </h1>
//           <p className="text-zinc-500 mt-1 font-medium text-sm uppercase tracking-wider">BillaMart retail operations at a glance.</p>
//         </div>
        
//         <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-2xl backdrop-blur-md">
//           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Status</p>
//           <p className="text-sm font-bold text-orange-500 uppercase italic">Operational Excellence</p>
//         </div>
//       </div>

//       {/* Statistics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {stats.map((stat, index) => (
//           <Card key={index} className="bg-zinc-900/30 border-zinc-800/80 rounded-[32px] overflow-hidden group hover:border-orange-600/40 transition-all duration-500 shadow-2xl backdrop-blur-xl">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
//                 {stat.title}
//               </CardTitle>
//               <div className={`p-2 rounded-xl bg-zinc-800/50 ${stat.color} group-hover:bg-orange-600 group-hover:text-white transition-all duration-300`}>
//                 <stat.icon className="h-4 w-4" />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</div>
//               <p className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
//                 {stat.trend} <span className="text-zinc-600 ml-1">vs last month</span>
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Main Content Area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Large Widget Area: Revenue Overview */}
//         <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-zinc-800/80 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
//           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
//              <TrendingUp className="h-32 w-32 text-orange-600" />
//           </div>
          
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h2 className="text-xl font-black uppercase italic tracking-tighter">Revenue Overview</h2>
//               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Financial Performance tracking</p>
//             </div>
//             <button className="text-[10px] font-black bg-zinc-800 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-orange-600 transition-colors">Export Report</button>
//           </div>
          
//           <div className="h-[350px] flex flex-col items-center justify-center border border-zinc-800/50 bg-black/20 rounded-[24px] text-zinc-700 relative group">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
//             <p className="font-black uppercase italic tracking-[0.3em] text-sm animate-pulse">Analytics Processing...</p>
//             <p className="text-[10px] font-bold text-zinc-800 mt-2 uppercase">[ Chart Component Integration Required ]</p>
//           </div>
//         </div>

//         {/* Recent Activity Sidebar */}
//         <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-[40px] p-8 backdrop-blur-xl">
//           <div className="flex items-center gap-2 mb-8">
//             <div className="h-2 w-2 rounded-full bg-orange-600 animate-ping" />
//             <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Live Stream</h2>
//           </div>
          
//           <div className="space-y-8">
//             {[1, 2, 3, 4].map((item) => (
//               <div key={item} className="flex items-center gap-5 group cursor-pointer">
//                 <div className="relative">
//                   <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-500 font-black group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-lg">
//                     AM
//                   </div>
//                   <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-orange-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
//                     <Zap className="h-2 w-2 text-white fill-white" />
//                   </div>
//                 </div>
                
//                 <div className="flex-1 border-b border-zinc-900 pb-2">
//                   <p className="text-sm font-black uppercase italic tracking-tight text-zinc-200 group-hover:text-orange-500 transition-colors">
//                     Ali Khan <span className="text-zinc-500 font-medium lowercase italic tracking-normal">placed an order</span>
//                   </p>
//                   <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">2 minutes ago</p>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           <button className="w-full mt-10 py-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all italic">
//             View All Activities
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






























import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, TrendingUp, Zap } from "lucide-react";
import { fetchDashboardStats } from "@/store/admin/dashboard-slice/Index.jsx";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount || 0);
}

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: TrendingUp,
      color: "text-orange-500",
      trend: stats?.totalRevenueTrend || "0%",
    },
    {
      title: "Active Orders",
      value: stats?.activeOrders ?? 0,
      icon: ShoppingCart,
      color: "text-orange-600",
      trend: stats?.activeOrdersTrend || "0%",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: "text-orange-500",
      trend: stats?.totalProductsTrend || "0%",
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "text-orange-600",
      trend: stats?.totalCustomersTrend || "0%",
    },
  ];

  return (
    <div className="p-8 space-y-10 bg-zinc-950 min-h-screen text-white font-sans relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] -z-10" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-orange-500 fill-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">System Live</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Executive <span className="text-orange-600">Dashboard</span>
          </h1>
          <p className="text-zinc-500 mt-1 font-medium text-sm uppercase tracking-wider">BillaMart retail operations at a glance.</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-3 rounded-2xl backdrop-blur-md">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Status</p>
          <p className="text-sm font-bold text-orange-500 uppercase italic">Operational Excellence</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-zinc-900/30 border-zinc-800/80 rounded-[32px] overflow-hidden group hover:border-orange-600/40 transition-all duration-500 shadow-2xl backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-zinc-800/50 ${stat.color} group-hover:bg-orange-600 group-hover:text-white transition-all duration-300`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-24 rounded-lg bg-zinc-800/60 animate-pulse" />
              ) : (
                <div className="text-3xl font-black text-white italic tracking-tighter">{stat.value}</div>
              )}
              <p className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
                {stat.trend} <span className="text-zinc-600 ml-1">vs last month</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Large Widget Area: Revenue Overview */}
        <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900/50 to-zinc-950 border border-zinc-800/80 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
             <TrendingUp className="h-32 w-32 text-orange-600" />
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Revenue Overview</h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Financial Performance tracking</p>
            </div>
            <button className="text-[10px] font-black bg-zinc-800 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-orange-600 transition-colors">Export Report</button>
          </div>

          <div className="h-[350px] flex flex-col items-center justify-center border border-zinc-800/50 bg-black/20 rounded-[24px] text-zinc-700 relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.05),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="font-black uppercase italic tracking-[0.3em] text-sm">
              Total Revenue: {formatCurrency(stats?.totalRevenue)}
            </p>
            <p className="text-[10px] font-bold text-zinc-800 mt-2 uppercase">[ Chart Component Integration Required ]</p>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-[40px] p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-2 w-2 rounded-full bg-orange-600 animate-ping" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">Live Stream</h2>
          </div>

          <div className="space-y-8">
            {isLoading ? (
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="h-12 rounded-2xl bg-zinc-800/40 animate-pulse" />
              ))
            ) : stats?.recentActivity?.length ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-5 group cursor-pointer">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-orange-500 font-black group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-lg">
                      {activity.username?.slice(0, 2)?.toUpperCase() || "GU"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-orange-600 rounded-full border-2 border-zinc-950 flex items-center justify-center">
                      <Zap className="h-2 w-2 text-white fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 border-b border-zinc-900 pb-2">
                    <p className="text-sm font-black uppercase italic tracking-tight text-zinc-200 group-hover:text-orange-500 transition-colors">
                      {activity.username} <span className="text-zinc-500 font-medium lowercase italic tracking-normal">placed an order</span>
                    </p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{activity.timeAgo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No recent activity yet.</p>
            )}
          </div>

          <button className="w-full mt-10 py-4 bg-zinc-800/50 border border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-orange-600 hover:text-white transition-all italic">
            View All Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
