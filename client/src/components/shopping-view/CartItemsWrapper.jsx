import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId,
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId,
        );
        const getTotalStock =
          getCurrentProductIndex > -1
            ? productList[getCurrentProductIndex]?.totalStock
            : getCartItem?.totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getTotalStock && getQuantity + 1 > getTotalStock) {
            toast.error(`Only ${getQuantity} quantity can be added for this item`);
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id || user?._id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item updated successfully");
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id || user?._id,
        productId: getCartItem?.productId,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart item deleted successfully");
      }
    });
  }

  return (
    <div className="flex items-center space-x-4 bg-zinc-900/50 p-3 rounded-xl border border-orange-600/5 hover:border-orange-600/20 transition-all group">
      {/* Product Image with BillaMart border */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Title & Quantity Controls */}
      <div className="flex-1 space-y-1">
        <h3 className="text-sm font-black uppercase italic tracking-tighter text-white truncate max-w-[140px]">
          {cartItem?.title}
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-zinc-800 rounded-full bg-zinc-950 p-1">
            <Button
              variant="ghost"
              className="h-6 w-6 rounded-full p-0 hover:bg-orange-600 hover:text-white transition-colors"
              size="icon"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
              <span className="sr-only">Decrease</span>
            </Button>
            
            <span className="w-8 text-center text-xs font-black text-orange-500">
              {cartItem?.quantity}
            </span>

            <Button
              variant="ghost"
              className="h-6 w-6 rounded-full p-0 hover:bg-orange-600 hover:text-white transition-colors"
              size="icon"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
              <span className="sr-only">Increase</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Price & Delete Action */}
      <div className="flex flex-col items-end gap-3">
        <p className="text-sm font-black text-white tracking-tighter">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="text-zinc-600 hover:text-red-500 transition-colors p-1"
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;