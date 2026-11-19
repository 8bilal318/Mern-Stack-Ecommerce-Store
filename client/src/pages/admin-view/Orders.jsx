// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ShoppingBag, Eye, Terminal } from "lucide-react";

// const Orders = () => {
//   // Mock Data
//   const orders = [
//     { id: "ORD-7721", date: "2026-04-25", status: "Pending", total: "$120.00" },
//     { id: "ORD-7722", date: "2026-04-24", status: "Confirmed", total: "$85.50" },
//     { id: "ORD-7723", date: "2026-04-23", status: "Delivered", total: "$210.00" },
//     { id: "ORD-7724", date: "2026-04-22", status: "Cancelled", total: "$45.00" },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending": return "bg-orange-600/20 text-orange-500 border border-orange-600/30";
//       case "Confirmed": return "bg-blue-600/20 text-blue-400 border border-blue-600/30";
//       case "Delivered": return "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30";
//       case "Cancelled": return "bg-zinc-800 text-zinc-500 border border-zinc-700";
//       default: return "bg-zinc-700 text-white";
//     }
//   };

//   return (
//     <div className="p-8 bg-zinc-950 min-h-screen text-white font-sans relative overflow-hidden">
//       {/* Background Brand Glow */}
//       <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -z-10" />

//       {/* Header Section */}
//       <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
//         <div>
//           {/* <div className="flex items-center gap-2 mb-2">
//             <Terminal className="h-4 w-4 text-orange-600" />
//             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Operations Console</span>
//           </div> */}
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
//             Order <span className="text-orange-600">Management</span>
//           </h1>
//           <p className="text-zinc-500 mt-2 font-medium text-sm uppercase tracking-wider">
//             Monitor and fulfill BillaMart customer transactions.
//           </p>
//         </div>

//         <div className="flex items-center gap-4">
//           <div className="text-right hidden sm:block">
//             <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Live Orders</p>
//             <p className="text-xl font-black italic text-white">24 Active</p>
//           </div>
//           <div className="h-12 w-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
//             <ShoppingBag className="h-6 w-6 text-white" />
//           </div>
//         </div>
//       </div>

//       {/* Orders Table Card */}
//       <Card className="bg-zinc-900/30 border-zinc-800/80 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
//         <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20 px-8 py-6">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">
//               Recent Transactions
//             </CardTitle>
//             <Badge variant="outline" className="border-zinc-700 text-zinc-500 font-bold uppercase text-[9px] tracking-widest">
//               Updated Just Now
//             </Badge>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-zinc-900/40">
//               <TableRow className="border-zinc-800 hover:bg-transparent">
//                 <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8 py-5">Order ID</TableHead>
//                 <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Date</TableHead>
//                 <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Status</TableHead>
//                 <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Net Total</TableHead>
//                 <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {orders.map((order) => (
//                 <TableRow key={order.id} className="border-zinc-900 transition-colors hover:bg-orange-600/[0.02] group">
//                   <TableCell className="px-8 py-5 font-black italic text-zinc-100 tracking-tighter">
//                     {order.id}
//                   </TableCell>
//                   <TableCell className="px-8 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
//                     {order.date}
//                   </TableCell>
//                   <TableCell className="px-8">
//                     <Badge className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm`}>
//                       {order.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="px-8 font-black text-orange-500 italic tracking-tighter text-base">
//                     {order.total}
//                   </TableCell>
//                   <TableCell className="px-8 text-right">
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       className="h-9 px-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-orange-600 hover:text-white transition-all group-hover:border-orange-500/50"
//                     >
//                       <Eye className="mr-2 h-3 w-3" />
//                       View
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
      
//       {/* Footer System Label */}
//       {/* <div className="mt-8 flex justify-center opacity-20">
//         <p className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-500">Secure Fulfillment Protocol</p>
//       </div> */}
//     </div>
//   );
// };

// export default Orders;




























import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye, Loader2, PackageSearch } from "lucide-react";
import {
  fetchAllOrdersForAdmin,
  fetchOrderDetailsForAdmin,
  clearOrderDetails,
} from "@/store/admin/order-slice/Index.jsx";
import AdminOrderDetailsDialog from "@/components/admin-view/OrderDetailsDialog";

const Orders = () => {
  const dispatch = useDispatch();
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.adminOrders);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchAllOrdersForAdmin());
  }, [dispatch]);

  function handleViewDetails(orderId) {
    dispatch(fetchOrderDetailsForAdmin(orderId)).then((data) => {
      if (data?.payload?.success) {
        setOpenDetailsDialog(true);
      }
    });
  }

  function handleDialogOpenChange(open) {
    setOpenDetailsDialog(open);
    if (!open) dispatch(clearOrderDetails());
  }

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

  const activeOrdersCount = orderList?.filter(
    (order) => !["delivered", "cancelled"].includes(order.orderStatus)
  ).length || 0;

  return (
    <div className="p-8 bg-zinc-950 min-h-screen text-white font-sans relative overflow-hidden">
      {/* Background Brand Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px] -z-10" />

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            Order <span className="text-orange-600">Management</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium text-sm uppercase tracking-wider">
            Monitor and fulfill BillaMart customer transactions.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Live Orders</p>
            <p className="text-xl font-black italic text-white">{activeOrdersCount} Active</p>
          </div>
          <div className="h-12 w-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(234,88,12,0.3)]">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="bg-zinc-900/30 border-zinc-800/80 rounded-[32px] overflow-hidden backdrop-blur-xl shadow-2xl">
        <CardHeader className="border-b border-zinc-800/50 bg-zinc-900/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 italic">
              Recent Transactions
            </CardTitle>
            <Badge variant="outline" className="border-zinc-700 text-zinc-500 font-bold uppercase text-[9px] tracking-widest">
              {orderList?.length || 0} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              <p className="text-xs font-black uppercase tracking-widest">Loading orders...</p>
            </div>
          ) : !orderList || orderList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500 gap-3">
              <PackageSearch className="h-10 w-10 text-zinc-700" />
              <p className="text-xs font-black uppercase tracking-widest">No orders yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-zinc-900/40">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8 py-5">Order ID</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Date</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Status</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Net Total</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-zinc-500 px-8">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderList.map((order) => (
                  <TableRow key={order._id} className="border-zinc-900 transition-colors hover:bg-orange-600/[0.02] group">
                    <TableCell className="px-8 py-5 font-black italic text-zinc-100 tracking-tighter">
                      #{order._id?.slice(-8)}
                    </TableCell>
                    <TableCell className="px-8 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                      {new Date(order.orderDate || order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-8">
                      <Badge className={`${getStatusColor(order.orderStatus)} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm`}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 font-black text-orange-500 italic tracking-tighter text-base">
                      ${order.totalAmount}
                    </TableCell>
                    <TableCell className="px-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(order._id)}
                        className="h-9 px-4 bg-zinc-800/50 border border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-orange-600 hover:text-white transition-all group-hover:border-orange-500/50"
                      >
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AdminOrderDetailsDialog
        open={openDetailsDialog}
        setOpen={handleDialogOpenChange}
        orderDetails={orderDetails}
      />
    </div>
  );
};

export default Orders;