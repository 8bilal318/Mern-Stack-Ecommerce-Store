
import { useEffect, useRef, useState } from "react";
import { AlignJustify, Bell, LogOut, Search, Store } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice/Index";
import {
  fetchNotifications,
  markNotificationsRead,
} from "@/store/admin/notification-slice/Index.jsx";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount } = useSelector(
    (state) => state.adminNotifications,
  );
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  // Refresh notifications when the admin panel opens and every 30 seconds
  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Close the dropdown when clicking outside the bell
  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleBellToggle() {
    const nextOpen = !bellOpen;
    setBellOpen(nextOpen);
    if (nextOpen && unreadCount > 0) {
      dispatch(markNotificationsRead());
    }
  }

  function timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  function onLogout() {
    dispatch(logoutUser()).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        navigate("/auth/login");
      }
    });
  }

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      {/* Container: BillaMart Deep Black base with Orange glow */}
      <div className="rounded-[28px] border border-orange-600/20 bg-zinc-950 px-6 py-4 shadow-[0_8px_30px_rgba(234,88,12,0.1)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen?.(true)}
              className="rounded-2xl border border-orange-600/30 bg-zinc-950 text-orange-500 hover:bg-orange-600/10 lg:hidden"
            >
              <AlignJustify className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-transform hover:rotate-6">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">
                  BillaMart
                </p>
                <h1 className="text-lg font-black text-white sm:text-xl uppercase italic tracking-tighter">
                  Admin <span className="text-orange-600">Panel</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input - Professional Zinc Style */}
            <div className="flex items-center gap-3 rounded-2xl border border-orange-600/10 bg-zinc-900 px-4 py-2.5 transition-all focus-within:border-orange-600/40 focus-within:ring-1 focus-within:ring-orange-600/20">
              <Search className="h-4 w-4 text-orange-600" />
              <input 
                placeholder="Search products..." 
                className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600 font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={bellRef}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleBellToggle}
                  className="relative rounded-2xl border border-orange-600/10 text-zinc-400 hover:bg-orange-600/10 hover:text-orange-500 transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[9px] font-black text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>

                {bellOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl border border-orange-600/20 bg-zinc-950 p-3 shadow-2xl backdrop-blur-xl">
                    <p className="px-2 pb-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      Notifications
                    </p>
                    <div className="max-h-80 space-y-1 overflow-y-auto">
                      {notifications.length ? (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            className="rounded-xl px-3 py-2.5 hover:bg-zinc-900/70"
                          >
                            <p className="text-xs font-bold text-zinc-200">{n.title}</p>
                            <p className="mt-0.5 text-[11px] text-zinc-500">{n.message}</p>
                            <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                              {timeAgo(n.createdAt)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="px-2 py-4 text-center text-[11px] text-zinc-600">
                          No notifications yet
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button - Signature Orange Accent */}
              <Button 
                onClick={onLogout} 
                className="group rounded-2xl bg-orange-600 px-5 py-2 text-white font-black uppercase tracking-widest text-xs shadow-[0_4px_15px_rgba(234,88,12,0.3)] transition-all hover:bg-orange-700 hover:scale-105 active:scale-95"
              >
                <LogOut className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
