// import {
//   BadgeCheck,
//   ChartNoAxesCombined,
//   LayoutDashboard,
//   ShoppingBasket,
//   Sparkles,
// } from "lucide-react";
// import { Fragment } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// const adminSidebarMenuItems = [
//   {
//     id: "dashboard",
//     label: "Dashboard",
//     path: "/admin/dashboard",
//     icon: LayoutDashboard,
//     description: "Overview and insights",
//   },
//   {
//     id: "products",
//     label: "Products",
//     path: "/admin/products",
//     icon: ShoppingBasket,
//     description: "Catalog and inventory",
//   },
//   {
//     id: "orders",
//     label: "Orders",
//     path: "/admin/orders",
//     icon: BadgeCheck,
//     description: "Sales and fulfillment",
//   },
// ];

// function MenuItems({ setOpen }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <nav className="mt-6 flex flex-col gap-3">
//       {adminSidebarMenuItems.map((menuItem) => {
//         const Icon = menuItem.icon;
//         const isActive = location.pathname === menuItem.path;

//         return (
//           <button
//             key={menuItem.id}
//             type="button"
//             onClick={() => {
//               navigate(menuItem.path);
//               setOpen?.(false);
//             }}
//             className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-[24px] border px-4 py-4 text-left transition-all duration-300 ${
//               isActive
//                 ? "border-transparent bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-600 text-white shadow-[0_16px_40px_rgba(234,88,12,0.2)]"
//                 : "border-zinc-800/80 bg-zinc-900/50 text-zinc-400 shadow-sm hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-zinc-900"
//             }`}
//           >
//             <div
//               className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
//                 isActive
//                   ? "bg-white/15 text-white"
//                   : "bg-zinc-800 text-zinc-500 group-hover:bg-orange-500/10 group-hover:text-orange-500"
//               }`}
//             >
//               <Icon className="h-5 w-5" />
//             </div>

//             <div className="min-w-0 flex-1">
//               <p className={`text-sm font-black uppercase italic tracking-tighter ${isActive ? 'text-white' : 'text-zinc-300'}`}>
//                 {menuItem.label}
//               </p>
//               <p
//                 className={`mt-0.5 text-[10px] font-medium uppercase tracking-tight ${
//                   isActive ? "text-orange-200/70" : "text-zinc-500"
//                 }`}
//               >
//                 {menuItem.description}
//               </p>
//             </div>

//             {isActive ? (
//               <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
//             ) : null}
//           </button>
//         );
//       })}
//     </nav>
//   );
// }

// function SidebarContent({ setOpen }) {
//   const navigate = useNavigate();

//   return (
//     <div className="flex h-full flex-col bg-zinc-950 p-5 text-white border-r border-zinc-900">
//       {/* Brand Logo Card */}
//       <div
//         onClick={() => navigate("/admin/dashboard")}
//         className="cursor-pointer rounded-[28px] bg-gradient-to-br from-orange-600 via-orange-700 to-zinc-950 p-6 text-white shadow-[0_18px_50px_rgba(234,88,12,0.15)] group transition-all"
//       >
//         <div className="flex flex-col gap-4">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 transition-transform group-hover:rotate-6">
//             <ChartNoAxesCombined className="h-7 w-7 text-white" />
//           </div>

//           <div>
//             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-200/80">
//               BillaMart Elite
//             </p>
//             <h1 className="mt-1 text-2xl font-black uppercase italic tracking-tighter">
//               Admin <span className="text-white/80">Panel</span>
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Section */}
//       <div className="mt-8 rounded-[28px] border border-zinc-800/50 bg-zinc-900/30 p-4 shadow-2xl backdrop-blur-xl">
//         <div className="flex items-center justify-between px-2">
//           <div>
//             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
//               Navigation
//             </p>
//             <h2 className="mt-1 text-xs font-bold text-zinc-200 uppercase tracking-tighter italic">
//               Core Modules
//             </h2>
//           </div>

//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600/10 text-orange-500">
//             <Sparkles className="h-4 w-4 animate-pulse" />
//           </div>
//         </div>

//         <MenuItems setOpen={setOpen} />
//       </div>

//       {/* Workspace Status Footer */}
//       <div className="mt-auto pt-5">
//         <div className="rounded-[26px] border border-zinc-800/80 bg-zinc-900/20 p-5 backdrop-blur-sm">
//           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
//             System Status
//           </p>
//           <div className="mt-3 flex items-center gap-3">
//             <div className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]"></span>
//             </div>
//             <p className="text-xs font-black uppercase italic tracking-tight text-zinc-300">
//               Live Environment
//             </p>
//           </div>
//           <p className="mt-3 text-[10px] leading-relaxed font-medium text-zinc-500 uppercase">
//             Store operations are synchronized and secured.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function AdminSideBar({ open, setOpen }) {
//   return (
//     <Fragment>
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetContent
//           side="left"
//           className="w-[310px] border-r border-zinc-900 bg-zinc-950 p-0"
//         >
//           <SheetHeader className="sr-only">
//             <SheetTitle>Admin navigation</SheetTitle>
//           </SheetHeader>
//           <SidebarContent setOpen={setOpen} />
//         </SheetContent>
//       </Sheet>

//       <aside className="hidden min-h-screen w-[310px] shrink-0 lg:block">
//         <SidebarContent setOpen={setOpen} />
//       </aside>
//     </Fragment>
//   );
// }

// export default AdminSideBar;



































import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and insights",
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
    description: "Catalog and inventory",
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
    description: "Sales and fulfillment",
  },
  {
    id: "features",
    label: "Features",
    path: "/admin/features",
    icon: SlidersHorizontal,
    description: "Modules and popup settings",
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-6 flex flex-col gap-3">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;
        const isActive = location.pathname === menuItem.path;

        return (
          <button
            key={menuItem.id}
            type="button"
            onClick={() => {
              navigate(menuItem.path);
              setOpen?.(false);
            }}
            className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-[24px] border px-4 py-4 text-left transition-all duration-300 ${
              isActive
                ? "border-transparent bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-600 text-white shadow-[0_16px_40px_rgba(234,88,12,0.2)]"
                : "border-zinc-800/80 bg-zinc-900/50 text-zinc-400 shadow-sm hover:-translate-y-0.5 hover:border-orange-500/40 hover:bg-zinc-900"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-zinc-800 text-zinc-500 group-hover:bg-orange-500/10 group-hover:text-orange-500"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-black uppercase italic tracking-tighter ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                {menuItem.label}
              </p>
              <p
                className={`mt-0.5 text-[10px] font-medium uppercase tracking-tight ${
                  isActive ? "text-orange-200/70" : "text-zinc-500"
                }`}
              >
                {menuItem.description}
              </p>
            </div>

            {isActive ? (
              <div className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SidebarContent({ setOpen }) {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-zinc-950 p-5 text-white border-r border-zinc-900">
      {/* Brand Logo Card */}
      <div
        onClick={() => navigate("/admin/dashboard")}
        className="cursor-pointer rounded-[28px] bg-gradient-to-br from-orange-600 via-orange-700 to-zinc-950 p-6 text-white shadow-[0_18px_50px_rgba(234,88,12,0.15)] group transition-all"
      >
        <div className="flex flex-col gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 transition-transform group-hover:rotate-6">
            <ChartNoAxesCombined className="h-7 w-7 text-white" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-200/80">
              BillaMart Elite
            </p>
            <h1 className="mt-1 text-2xl font-black uppercase italic tracking-tighter">
              Admin <span className="text-white/80">Panel</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mt-8 rounded-[28px] border border-zinc-800/50 bg-zinc-900/30 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Navigation
            </p>
            <h2 className="mt-1 text-xs font-bold text-zinc-200 uppercase tracking-tighter italic">
              Core Modules
            </h2>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600/10 text-orange-500">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
        </div>

        <MenuItems setOpen={setOpen} />
      </div>

      {/* Workspace Status Footer */}
      <div className="mt-auto pt-5">
        <div className="rounded-[26px] border border-zinc-800/80 bg-zinc-900/20 p-5 backdrop-blur-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            System Status
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]"></span>
            </div>
            <p className="text-xs font-black uppercase italic tracking-tight text-zinc-300">
              Live Environment
            </p>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed font-medium text-zinc-500 uppercase">
            Store operations are synchronized and secured.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminSideBar({ open, setOpen }) {
  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[310px] border-r border-zinc-900 bg-zinc-950 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      <aside className="hidden min-h-screen w-[310px] shrink-0 lg:block">
        <SidebarContent setOpen={setOpen} />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;