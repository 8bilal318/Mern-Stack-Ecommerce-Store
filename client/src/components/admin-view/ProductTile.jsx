import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const hasSalePrice = Number(product?.salePrice) > 0;
  const displayPrice = hasSalePrice ? product?.salePrice : product?.price;

  return (
    <Card className="group h-full w-full overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-950 text-white shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-600/30 hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)]">
      <div className="flex h-full flex-col">
        {/* Product Image Section */}
        <div className="relative border-b border-zinc-800/50 bg-zinc-900/50 p-4">
          <div className="flex h-[140px] items-center justify-center rounded-[20px] border border-zinc-800 bg-zinc-950 p-3 transition-transform duration-500 group-hover:scale-[1.02]">
            {product?.image ? (
              <img
                src={product.image}
                alt={product?.title}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">
                No Preview
              </div>
            )}
          </div>

          {/* Category & Title */}
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
                {product?.category || "General"}
              </p>
              <h2 className="mt-1 line-clamp-1 text-base font-black uppercase italic tracking-tighter text-white">
                {product?.title}
              </h2>
            </div>
            <div className="shrink-0 rounded-lg border border-orange-600/20 bg-orange-600/10 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-orange-500">
              {product?.brand || "BillaMart"}
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <CardContent className="flex flex-1 flex-col gap-4 p-4">
          <p className="line-clamp-2 min-h-[32px] text-[11px] font-medium leading-relaxed text-zinc-400">
            {product?.description || "High-quality product from BillaMart inventory."}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                Stock Level
              </p>
              <p className={`mt-1 text-lg font-black tracking-tighter ${product?.totalStock < 10 ? 'text-red-500' : 'text-white'}`}>
                {product?.totalStock ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                Unit Price
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                {hasSalePrice && (
                  <span className="text-[10px] font-bold text-zinc-600 line-through">
                    ${product?.price}
                  </span>
                )}
                <span className="text-lg font-black text-orange-500 tracking-tighter">
                  ${displayPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Sale Status Badge */}
          <div
            className={`min-h-[36px] flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              hasSalePrice
                ? "border border-orange-600/20 bg-orange-600/10 text-orange-500 animate-pulse"
                : "opacity-0"
            }`}
          >
            {hasSalePrice ? `🔥 Flash Sale Active` : ""}
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="mt-auto grid grid-cols-2 gap-3 p-4 pt-0">
          <Button
            className="h-10 rounded-xl bg-white text-[12px] font-black uppercase tracking-widest text-black transition-all hover:bg-orange-600 hover:text-white"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            className="h-10 rounded-xl border border-red-600/20 bg-red-600/10 text-[12px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-600 hover:text-white"
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;