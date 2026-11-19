import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2, Download } from "lucide-react";
import { downloadReceipt } from "@/utils/downloadReceipt";
import { resetCart, fetchCartItems } from "@/store/shop/cart-slice";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const userId = user?.id || user?._id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    dispatch(resetCart());

    if (!orderId) {
      setLoading(false);
      return;
    }

    // Server Stripe se payment verify karega: order paid, stock, cart khali aur receipt email yahin se ho jati hai
    // (webhook chale ya na chale, dono surat mein kaam karega).
    axios
      .get(`${API_BASE_URL}/api/shop/order/verify/${orderId}`, { withCredentials: true })
      .then((res) => setOrder(res.data.data))
      .catch(() => {
        // verify fail ho to normal order fetch se kam az kam details dikha do
        return axios
          .get(`${API_BASE_URL}/api/shop/order/${orderId}`, { withCredentials: true })
          .then((res) => setOrder(res.data.data))
          .catch(() => {});
      })
      .finally(() => {
        setLoading(false);
        // Server ka cart ab khali hai, usi ko dobara le aao taake header ka cart count bhi sahi ho
        if (userId) dispatch(fetchCartItems(userId));
      });
  }, [orderId, userId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Successful</h1>
        <p className="text-gray-500 text-sm mb-6">Your order has been confirmed and is being processed.</p>

        {loading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
          </div>
        ) : order ? (
          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 text-left mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium text-gray-800">#{order._id.slice(-8)}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Paid</span>
                <span className="font-bold text-orange-600">${order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-emerald-600 capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </Card>
        ) : (
          <p className="text-gray-500 text-sm mb-6">
            Order details could not be loaded, but your payment was received.
          </p>
        )}

        {order && order.paymentStatus === "paid" && (
          <Button
            variant="outline"
            onClick={() => downloadReceipt(order._id)}
            className="w-full h-12 mb-3 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Download className="h-4 w-4 mr-2" /> Download Receipt
          </Button>
        )}

        <Button
          onClick={() => navigate("/shop/home")}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
