import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSideBar from "./Sidebar";
import AdminHeader from "./Header";

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-orange-600/30">
      {/* Dynamic Sidebar with BillaMart Branding */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} />

      <div className="flex min-w-0 flex-1 flex-col relative overflow-hidden">
        {/* Subtle Background Glow for Premium Feel */}
        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />
        
        <AdminHeader setOpen={setOpenSidebar} />

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7 z-10">
          {/* Content Container: BillaMart Glassmorphism Style */}
          <div className="min-h-[calc(100vh-7rem)] rounded-[32px] border border-zinc-800/50 bg-zinc-900/40 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md sm:p-6 transition-all duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;