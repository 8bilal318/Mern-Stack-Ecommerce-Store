import { filterOptions } from "@/config/Index.js";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { SlidersHorizontal } from "lucide-react";

function ProductFilter({ filters, handleFilter, onClear, activeCount = 0 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2 text-zinc-100">
          <SlidersHorizontal className="h-4 w-4 text-orange-500" />
          <h2 className="text-base font-semibold">Filters</h2>
        </div>
        {activeCount > 0 && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-orange-500 hover:text-orange-400 focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="divide-y divide-zinc-800">
        {Object.keys(filterOptions).map((keyItem) => (
          <div key={keyItem} className="px-5 py-4">
            <h3 className="mb-2 text-sm font-semibold capitalize text-zinc-300">
              {keyItem}
            </h3>
            <div className="grid gap-0.5">
              {filterOptions[keyItem].map((option) => {
                const checked = !!filters?.[keyItem]?.includes(option.id);
                return (
                  <Label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-zinc-800 ${
                      checked ? "text-white" : "text-zinc-400"
                    }`}
                  >
                    <Checkbox
                      className="h-4 w-4 rounded border-zinc-600 data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600"
                      checked={checked}
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
