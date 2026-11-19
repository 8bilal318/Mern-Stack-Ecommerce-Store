import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./CartItemsWrapper";
import { ShoppingBag } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-zinc-950 border-l-orange-600/20 text-white p-6 flex flex-col h-full">
      <SheetHeader className="border-b border-zinc-800 pb-4">
        <SheetTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          Your <span className="text-orange-500">Cart</span>
        </SheetTitle>
      </SheetHeader>

      {/* Scrollable Cart Items Section */}
      <div className="mt-8 space-y-6 overflow-y-auto flex-grow pr-2 custom-scrollbar">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.productId} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <UserCartItemsContent cartItem={item} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500 italic">
            <p>Your cart is empty.</p>
          </div>
        )}
      </div>

      {/* Summary & Action Section */}
      <div className="mt-auto pt-6 border-t border-zinc-800 space-y-4">
        <div className="flex justify-between items-center px-2">
          <span className="text-zinc-400 font-bold uppercase tracking-widest text-xs">
            Subtotal
          </span>
          <span className="text-2xl font-black text-orange-500 tracking-tighter">
            ${totalCartAmount.toFixed(2)}
          </span>
        </div>
        
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet?.(false);
          }}
          className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-600/10 active:scale-95 transition-all"
        >
          Proceed to Checkout
        </Button>

        <p className="text-[10px] text-center text-zinc-600 uppercase font-medium tracking-tight">
          Shipping & taxes calculated at checkout
        </p>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;