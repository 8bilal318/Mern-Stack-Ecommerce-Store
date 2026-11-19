
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import ShoppingHeader from "./Header";
import ChatbotWidget from "./ChatbotWidget";
import { fetchPublicSettings } from "@/store/shop/settings-slice";

function ShoppingLayout() {
  const dispatch = useDispatch();
  const { storefront } = useSelector((state) => state.shopSettings);

  // Fetch the public settings once when the app loads (storefront on/off, popup, etc.)
  useEffect(() => {
    dispatch(fetchPublicSettings());
  }, [dispatch]);

  if (!storefront) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-600/10 text-orange-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter">
          Store Under <span className="text-orange-600">Maintenance</span>
        </h1>
        <p className="max-w-md text-sm font-medium text-zinc-500">
          We are making some improvements right now. Please check back
          shortly.
        </p>
      </div>
    );
  }

  return (
    // use bg-black (or zinc-950) instead of bg-white
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      
      {/* common header */}
      <ShoppingHeader />

      {/* Main content area */}
      <main className="flex flex-col w-full flex-1">
        <Outlet />
      </main>
      
      {/* Optional: a footer can be added here */}

       {/* 24/7 AI customer support chatbot */}
      <ChatbotWidget />
    </div>
  );
}

export default ShoppingLayout;