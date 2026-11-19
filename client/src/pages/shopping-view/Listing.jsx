import React, { useEffect, useState } from "react";
import ProductFilter from "@/components/shopping-view/Filter";
import ShoppingProductTile from "../../components/shopping-view/ProductTile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDownIcon, SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  clearProductDetails,
} from "@/store/shop/product-slice";
import { addToCart } from "@/store/shop/cart-slice";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/productDetails";
import { toast } from "sonner";
import { filterOptions } from "@/config/Index.js";

const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

function createSearchParamsHelper(filters) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts,
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categorySearchParam = searchParams.get("category");

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (sectionId, currentOption) => {
    const currentValues = filters?.[sectionId] || [];
    const nextValues = currentValues.includes(currentOption)
      ? currentValues.filter((value) => value !== currentOption)
      : [...currentValues, currentOption];

    const cpyFilters = { ...filters, [sectionId]: nextValues };

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const activeFilterChips = Object.entries(filters || {}).flatMap(
    ([sectionId, values]) =>
      (values || []).map((value) => ({
        sectionId,
        value,
        label:
          filterOptions[sectionId]?.find((option) => option.id === value)
            ?.label || value,
      })),
  );

  const handleClearFilters = () => {
    sessionStorage.setItem("filters", JSON.stringify({}));
    setFilters({});
    setSearchParams(new URLSearchParams());
  };

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId) {
    const userId = user?.id || user?._id;
    const currentProduct = productList?.find(
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


  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters, setSearchParams]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filtersParams: filters, sortParams: sort }),
      );
  }, [dispatch, filters, sort]);


  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    }
  }, [productDetails]);

  // Clear productDetails from Redux when leaving this page,
  // so a previously opened product does not pop open when coming back
  useEffect(() => {
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch]);

  // Also clear productDetails when the dialog is closed
  function handleDialogOpenChange(isOpen) {
    setOpen(isOpen);
    if (!isOpen) {
      dispatch(clearProductDetails());
    }
  }

  const productCount = productList?.length || 0;
  const showSkeleton = isLoading && productCount === 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
      {/* Page heading */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            All Products
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {showSkeleton
              ? "Loading products..."
              : `${productCount} ${productCount === 1 ? "product" : "products"}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-10 gap-2 border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:bg-zinc-800 hover:text-white md:hidden"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterChips.length > 0 && (
              <span className="rounded-full bg-orange-600 px-1.5 text-xs font-semibold text-white">
                {activeFilterChips.length}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="h-10 gap-2 border-zinc-700 bg-zinc-900 px-3 text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                <ArrowUpDownIcon className="h-4 w-4" />
                <span>
                  {sortOptions.find((option) => option.id === sort)?.label ||
                    "Sort by"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[210px]">
              <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                {sortOptions.map((sortItem) => (
                  <DropdownMenuRadioItem key={sortItem.id} value={sortItem.id}>
                    {sortItem.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] lg:gap-8">
        {/* Filters: always visible on desktop, toggled on mobile */}
        <aside
          className={`${showFilters ? "block" : "hidden"} md:block md:self-start md:sticky md:top-24`}
        >
          <ProductFilter
            filters={filters}
            handleFilter={handleFilter}
            onClear={handleClearFilters}
            activeCount={activeFilterChips.length}
          />
        </aside>

        <section aria-label="Products">
          {/* Active filter chips */}
          {activeFilterChips.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeFilterChips.map((chip) => (
                <button
                  key={`${chip.sectionId}-${chip.value}`}
                  type="button"
                  onClick={() => handleFilter(chip.sectionId, chip.value)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 py-1 pl-3 pr-2 text-sm text-zinc-200 transition-colors hover:border-zinc-500"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label}
                  <X className="h-3.5 w-3.5 text-zinc-400" />
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-1 text-sm font-medium text-orange-500 hover:text-orange-400"
              >
                Clear all
              </button>
            </div>
          )}

          {showSkeleton ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900"
                >
                  <div className="aspect-square w-full animate-pulse bg-zinc-800" />
                  <div className="space-y-3 p-4">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-800" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
                    <div className="h-8 w-full animate-pulse rounded bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : productCount > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 px-6 py-20 text-center">
              <PackageSearch className="h-10 w-10 text-zinc-600" />
              <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                No products found
              </h2>
              <p className="mt-1 max-w-sm text-sm text-zinc-400">
                Nothing matches your current filters. Try removing a filter to
                see more products.
              </p>
              {activeFilterChips.length > 0 && (
                <Button
                  onClick={handleClearFilters}
                  className="mt-5 h-10 bg-orange-600 px-4 text-white hover:bg-orange-500"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </section>
      </div>

      <ProductDetailsDialog
        open={open}
        setOpen={handleDialogOpenChange}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ShoppingListing;
