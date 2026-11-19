import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Star, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import { brandOptionsMap, categoryOptionsMap } from "@/config/Index.js";

const reviews = [
  {
    name: "Ali Khan",
    rating: 5,
    text: "Top-notch quality! BillaMart never disappoints with the premium finishing.",
  },
  {
    name: "Sara Ahmed",
    rating: 4,
    text: "Excellent design and smooth delivery. Definitely worth the price.",
  },
  {
    name: "Usman",
    rating: 5,
    text: "10/10 experience. The product exceeded my expectations.",
  },
];

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
}) {
  if (!productDetails) return null;

  const hasSalePrice =
    productDetails?.salePrice > 0 &&
    productDetails?.salePrice < productDetails?.price;
  const discount = hasSalePrice
    ? Math.round(
        ((productDetails.price - productDetails.salePrice) /
          productDetails.price) *
          100,
      )
    : 0;
  const outOfStock = !(productDetails?.totalStock > 0);
  const lowStock = !outOfStock && productDetails?.totalStock < 10;
  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        className="grid max-h-[90vh] max-w-[95vw] grid-cols-1 gap-6 overflow-y-auto border-zinc-800 bg-zinc-950 p-5 text-zinc-100 shadow-2xl sm:max-w-[80vw] sm:p-8 md:grid-cols-2 md:gap-10 lg:max-w-[62vw]"
      >
        <DialogTitle className="sr-only">{productDetails?.title}</DialogTitle>

        {/* Image */}
        <div className="relative self-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
          <img
            src={productDetails?.image || "/placeholder.png"}
            alt={productDetails?.title}
            className={`aspect-square w-full object-cover ${
              outOfStock ? "opacity-60 grayscale" : ""
            }`}
          />
          {hasSalePrice && !outOfStock && (
            <Badge className="absolute left-3 top-3 h-6 rounded-md border-0 bg-orange-600 px-2.5 text-xs font-semibold text-white">
              {discount}% off
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="h-6 rounded-md border-orange-600/40 bg-orange-600/10 px-2.5 text-xs font-medium text-orange-400"
            >
              {categoryOptionsMap[productDetails?.category] ||
                productDetails?.category}
            </Badge>
            <Badge
              variant="outline"
              className="h-6 rounded-md border-zinc-700 bg-zinc-900 px-2.5 text-xs font-medium text-zinc-300"
            >
              {brandOptionsMap[productDetails?.brand] || productDetails?.brand}
            </Badge>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {productDetails?.title}
          </h1>

          {/* Rating summary */}
          <div className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(averageRating)
                      ? "fill-orange-500 text-orange-500"
                      : "text-zinc-700"
                  }
                />
              ))}
            </div>
            <span>
              {averageRating} ({reviews.length} reviews)
            </span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
            {productDetails?.description}
          </p>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-orange-500 sm:text-4xl">
              ${hasSalePrice ? productDetails?.salePrice : productDetails?.price}
            </span>
            {hasSalePrice && (
              <span className="text-lg text-zinc-500 line-through">
                ${productDetails?.price}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            {outOfStock ? (
              <Badge className="h-6 rounded-md border-0 bg-red-500/15 px-2.5 text-xs font-medium text-red-400">
                Out of stock
              </Badge>
            ) : (
              <Badge className="h-6 rounded-md border-0 bg-emerald-500/15 px-2.5 text-xs font-medium text-emerald-400">
                {lowStock
                  ? `Only ${productDetails?.totalStock} left`
                  : `In stock (${productDetails?.totalStock} units)`}
              </Badge>
            )}
          </div>

          {/* Action */}
          <div className="mt-6">
            {outOfStock ? (
              <Button
                className="h-12 w-full cursor-not-allowed rounded-xl bg-zinc-800 font-semibold text-zinc-500"
                disabled
              >
                Out of stock
              </Button>
            ) : (
              <Button
                className="h-12 w-full gap-2 rounded-xl bg-orange-600 font-semibold text-white transition-colors hover:bg-orange-500 active:scale-[0.99]"
                onClick={() => handleAddToCart?.(productDetails?._id)}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to cart
              </Button>
            )}
          </div>

          {/* Trust points */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
              <Truck className="h-4 w-4 text-orange-500" />
              Fast delivery
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              Secure payment
            </div>
          </div>

          <Separator className="my-6 bg-zinc-800" />

          {/* Reviews */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <h2 className="mb-3 text-base font-semibold text-white">
              Customer reviews
            </h2>

            <div className="max-h-[180px] space-y-3 overflow-y-auto pr-1">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {review.name}
                    </h3>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "fill-orange-500 text-orange-500"
                              : "text-zinc-700"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;