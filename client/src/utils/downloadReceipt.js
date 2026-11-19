import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Order ki receipt PDF download karta hai (login cookie ke sath).
export async function downloadReceipt(orderId) {
  if (!orderId) return;
  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/shop/order/receipt/${orderId}`,
      { responseType: "blob", withCredentials: true }
    );
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${orderId.slice(-8)}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    // Error response blob hota hai, usme se server ka message nikalo
    let message = "Could not download receipt. Please try again.";
    try {
      if (err?.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        message = JSON.parse(text)?.message || message;
      }
    } catch {
      /* default message hi rahega */
    }
    toast.error(message);
  }
}
