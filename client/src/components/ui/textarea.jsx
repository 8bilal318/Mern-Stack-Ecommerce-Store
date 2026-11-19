// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Textarea({
//   className,
//   ...props
// }) {
//   return (
//     <textarea
//       data-slot="textarea"
//       className={cn(
//         "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
//         className
//       )}
//       {...props} />
//   );
// }

// export { Textarea }





















import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-30 rounded-[16px] border border-zinc-800 bg-zinc-950 px-4 py-3 text-base text-white transition-all duration-300 outline-none",
        "placeholder:text-zinc-600",
        "focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-red-500/50 aria-invalid:ring-red-500/10",
        className
      )}
      {...props}
    />
  );
})

Textarea.displayName = "Textarea"

export { Textarea }