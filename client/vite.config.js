import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
       "@": path.resolve(__dirname, "./src"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@components": path.resolve(__dirname, "./src/components")
    },
  },
})





// import { defineConfig } from "vite";
// import tailwindcss from "@tailwindcss/vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],

//   server: {
//     open: true, // npm run dev par browser automatically open hoga
//   },

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//       "@config": path.resolve(__dirname, "./src/config"),
//       "@store": path.resolve(__dirname, "./src/store"),
//       "@components": path.resolve(__dirname, "./src/components"),
//     },
//   },
// });