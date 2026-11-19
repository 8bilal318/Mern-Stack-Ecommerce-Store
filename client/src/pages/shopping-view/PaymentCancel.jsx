import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 text-sm mb-8">
          No worries — your card was not charged. You can try again anytime.
        </p>

        <Button
          onClick={() => navigate("/shop/checkout")}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
        >
          Back to Checkout
        </Button>
      </div>
    </div>
  );
}
