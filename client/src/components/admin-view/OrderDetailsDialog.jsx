import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { orderStatusOptions } from "@/config/Index.js";
import {
  updateOrderStatus,
  fetchAllOrdersForAdmin,
} from "@/store/admin/order-slice/Index.jsx";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { downloadReceipt } from "@/utils/downloadReceipt";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-orange-600/20 text-orange-500 border border-orange-600/30";
    case "confirmed":
      return "bg-blue-600/20 text-blue-400 border border-blue-600/30";
    case "shipped":
      return "bg-purple-600/20 text-purple-400 border border-purple-600/30";
    case "delivered":
      return "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30";
    case "cancelled":
      return "bg-zinc-800 text-zinc-500 border border-zinc-700";
    default:
      return "bg-zinc-700 text-white";
  }
};

function AdminOrderDetailsDialog({ open, setOpen, orderDetails }) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setStatus(orderDetails?.orderStatus || "");
  }, [orderDetails]);

  if (!orderDetails) return null;

  function handleUpdateStatus() {
    if (!status) return;

    setIsUpdating(true);
    dispatch(updateOrderStatus({ id: orderDetails._id, orderStatus: status }))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success("Order status updated successfully");
          dispatch(fetchAllOrdersForAdmin());
        } else {
          toast.error("Failed to update order status");
        }
      })
      .finally(() => setIsUpdating(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent aria-describedby={undefined} className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto border-orange-600/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-black italic uppercase tracking-tighter text-2xl">
            Order <span className="text-orange-600">#{orderDetails._id?.slice(-8)}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Order Date
            </span>
            <span className="font-bold">
              {new Date(orderDetails.orderDate || orderDetails.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Payment Method
            </span>
            <span className="font-bold uppercase">{orderDetails.paymentMethod}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Payment Status
            </span>
            <span className="font-bold uppercase">{orderDetails.paymentStatus}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Total Amount
            </span>
            <span className="font-black text-orange-500 text-lg">
              ${orderDetails.totalAmount}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
              Current Status
            </span>
            <Badge className={`${getStatusColor(orderDetails.orderStatus)} px-3 py-1 rounded-full text-[10px] font-black uppercase`}>
              {orderDetails.orderStatus}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">
              Items
            </h3>
            <div className="space-y-3">
              {orderDetails.cartItems?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                    )}
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-orange-500">${item.price}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">
              Shipping Address
            </h3>
            <div className="text-sm text-zinc-400 space-y-1">
              <p>{orderDetails.addressInfo?.address}</p>
              <p>{orderDetails.addressInfo?.city} - {orderDetails.addressInfo?.pincode}</p>
              <p>Phone: {orderDetails.addressInfo?.phone}</p>
              {orderDetails.addressInfo?.notes && <p>Notes: {orderDetails.addressInfo?.notes}</p>}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">
              Receipt
            </h3>
            <Button
              variant="outline"
              className="w-full font-black uppercase tracking-widest text-xs border-orange-600/40 text-orange-500 hover:bg-orange-600 hover:text-white"
              onClick={() => downloadReceipt(orderDetails._id)}
            >
              <Download className="h-4 w-4 mr-2" /> Download Receipt (PDF)
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-3">
              Update Order Status
            </h3>
            <div className="flex gap-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatusOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="bg-orange-600 hover:bg-orange-700 font-black uppercase tracking-widest text-xs px-6"
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === orderDetails.orderStatus}
              >
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminOrderDetailsDialog;
