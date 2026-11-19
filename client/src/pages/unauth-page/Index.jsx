import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Terminal, LockKeyhole, ArrowLeft } from 'lucide-react';

const Unauth = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-center px-6 relative overflow-hidden font-sans">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-10" />

      {/* Brand Badge */}
      <div className="flex items-center gap-2 mb-12 opacity-50">
        <Terminal className="h-4 w-4 text-orange-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">Security Protocol</span>
      </div>

      {/* Visual Icon Section */}
      <div className="relative mb-10">
        <div className="p-10 bg-zinc-900/50 backdrop-blur-3xl rounded-[40px] border border-zinc-800 shadow-2xl -rotate-3 group hover:rotate-0 transition-transform duration-500">
          <LockKeyhole className="w-16 h-16 md:w-20 md:h-20 text-orange-600 animate-pulse" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/40 rounded-full blur-md" />
      </div>

      {/* Text Content */}
      <div className="space-y-4 max-w-lg px-4">
        <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none opacity-90 uppercase">
          Access <span className="text-orange-600">Denied</span>
        </h1>
        <div className="space-y-2">
          <h2 className="text-lg md:text-xl font-black text-zinc-100 uppercase italic tracking-tight">
            Unauthorized Entry Detected
          </h2>
          <p className="text-zinc-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] max-w-[280px] md:max-w-xs mx-auto leading-relaxed">
            Your current credentials do not have the clearance for the <span className="text-orange-600">BillaMart</span> administrative grid.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-[450px] px-4">
        <Button 
          onClick={() => navigate('/shop/home')} 
          className="flex-1 h-14 bg-orange-600 text-white hover:bg-orange-700 font-black uppercase tracking-wider italic rounded-2xl transition-all shadow-[0_15px_40px_rgba(234,88,12,0.3)] hover:translate-y-[-4px] active:translate-y-0 group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform shrink-0" />
          Back to Shop
        </Button>

        <Button 
          variant="outline"
          onClick={() => navigate('/auth/login')} 
          className="flex-1 h-14 bg-transparent border-zinc-800 text-white hover:bg-zinc-900 hover:text-white font-black uppercase tracking-wider italic rounded-2xl transition-all"
        >
          Secure Login
        </Button>
      </div>

      {/* System Label Footer */}
      <div className="absolute bottom-10">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-800 italic">
          BillaMart Firewall © 2026 Secured
        </p>
      </div>
    </div>
  );
};

export default Unauth;