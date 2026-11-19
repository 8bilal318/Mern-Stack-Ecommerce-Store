import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import ShoppingProductTile from "../../components/shopping-view/ProductTile";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import {
  fetchProductDetails,
  clearProductDetails,
} from "@/store/shop/product-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keyword && keyword.trim().length > 2) {
        setSearchParams(new URLSearchParams(`keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      } else {
        setSearchParams(new URLSearchParams());
        dispatch(resetSearchResults());
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    }
  }, [productDetails]);

  useEffect(() => {
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch]);

  function handleDialogOpenChange(isOpen) {
    setOpen(isOpen);
    if (!isOpen) {
      dispatch(clearProductDetails());
    }
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    const userId = user?.id || user?._id;
    const currentProduct = searchResults?.find(
      (product) => product._id === getCurrentProductId,
    );

    if (!userId) {
      toast.error("Please login to add items to your cart");
      return;
    }

    if (!currentProduct) {
      toast.error("Product not found");
      return;
    }

    const currentCartItem = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId,
    );
    const currentQuantity = currentCartItem?.quantity || 0;

    if (currentQuantity >= currentProduct.totalStock) {
      toast.error(`Only ${currentProduct.totalStock} item(s) available in stock`);
      return;
    }

    dispatch(
      addToCart({
        userId,
        productId: getCurrentProductId,
        quantity: 1,
      }),
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item added to cart");
        return;
      }

      toast.error(data?.payload?.message || "Failed to add item to cart");
    });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-xl relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search products by name, category or brand..."
            autoFocus
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-muted-foreground">
          Searching...
        </div>
      ) : keyword.trim().length > 0 && keyword.trim().length <= 2 ? (
        <div className="text-center py-10 text-muted-foreground">
          Please enter at least 3 characters to search.
        </div>
      ) : searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {searchResults.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              product={productItem}
              handleGetProductDetails={handleGetProductDetails}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : keyword.trim().length > 2 ? (
        <div className="text-center py-10 text-muted-foreground">
          No products found matching "{keyword}".
        </div>
      ) : null}

      <ProductDetailsDialog
        open={open}
        setOpen={handleDialogOpenChange}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default Search;