import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-zinc-950 overflow-hidden font-sans">
      
      {/* LEFT SIDE: Form Content (40%) */}
      <main className="flex w-full lg:w-2/5 items-center justify-center bg-orange-600 px-4 py-12 relative border-r border-zinc-900/50">
        {/* Subtle Grid Background for Auth Side */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#ea580c 1px, transparent 1px), linear-gradient(90deg, #ea580c 1px, transparent 1px)`, backgroundSize: '35px 35px' }} 
        />
        
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* RIGHT SIDE: BillaMart Branding (60%) */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-black w-3/5 px-12 overflow-hidden">
        {/* Brand Glow Effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-lg space-y-10 text-center">
          {/* Logo Icon with Tilt and Glow */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block"
          >
            <div className="p-10 bg-gradient-to-br from-orange-600/20 to-transparent backdrop-blur-2xl rounded-[48px] border border-orange-600/30 shadow-[0_20px_50px_rgba(234,88,12,0.15)] -rotate-3 transition-transform hover:rotate-0 duration-500">
              <ShoppingBag className="w-24 h-24 text-orange-500" />
            </div>
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
              Billa<span className="text-orange-600">Mart</span>
            </h1>
            <div className="h-1.5 w-24 bg-orange-600 mx-auto rounded-full" />
            <p className="mt-6 text-zinc-500 text-sm font-black uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
              Premium E-commerce <br/> Management Suite
            </p>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="absolute bottom-10 flex items-center gap-4">
          <div className="h-[1px] w-8 bg-zinc-800" />
          <div className="text-zinc-600 text-[10px] font-black tracking-[0.25em] uppercase italic">
            © 2026 BillaMart Operations System
          </div>
          <div className="h-[1px] w-8 bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;