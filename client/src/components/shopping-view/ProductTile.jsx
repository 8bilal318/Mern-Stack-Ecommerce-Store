import { brandOptionsMap, categoryOptionsMap } from "@/config/Index.js";
import { ShoppingCart } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) {
  const outOfStock = product?.totalStock === 0;
  const lowStock = !outOfStock && product?.totalStock < 10;
  const onSale = product?.salePrice > 0 && product?.salePrice < product?.price;
  const discount = onSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <article className="group flex w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-colors duration-200 hover:border-zinc-600">
      {/* Square image area */}
      <button
        type="button"
        onClick={() => handleGetProductDetails(product?._id)}
        className="relative block aspect-square w-full overflow-hidden bg-zinc-800 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-500"
        aria-label={`View details for ${product?.title}`}
      >
        <img
          src={product?.image}
          alt={product?.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            outOfStock ? "opacity-50 grayscale" : ""
          }`}
        />

        {/* Status badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {outOfStock ? (
            <span className="rounded-md bg-zinc-950/90 px-2 py-1 text-xs font-semibold text-zinc-200">
              Out of stock
            </span>
          ) : (
            <>
              {onSale && (
                <span className="rounded-md bg-orange-600 px-2 py-1 text-xs font-semibold text-white">
                  {discount}% off
                </span>
              )}
              {lowStock && (
                <span className="rounded-md bg-zinc-950/90 px-2 py-1 text-xs font-semibold text-orange-400">
                  Only {product?.totalStock} left
                </span>
              )}
            </>
          )}
        </div>
      </button>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-zinc-500">
            {brandOptionsMap[product?.brand] || product?.brand}
            {" \u2022 "}
            {categoryOptionsMap[product?.category] || product?.category}
          </p>
          <h3
            className="mt-1 truncate text-base font-semibold text-zinc-100"
            title={product?.title}
          >
            {product?.title}
          </h3>
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-lg font-bold ${
                onSale ? "text-orange-500" : "text-white"
              }`}
            >
              ${onSale ? product?.salePrice : product?.price}
            </span>
            {onSale && (
              <span className="text-sm text-zinc-500 line-through">
                ${product?.price}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={outOfStock}
            onClick={() => handleAddToCart?.(product?._id)}
            className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg sm:w-auto bg-orange-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ShoppingProductTile;
