import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config/Index.js";
import { logoutUser } from "@/store/auth-slice/Index.jsx";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import CartWrapper from "./CartWrapper";

// 👇 shadcn dropdown + avatar imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";

// ---------------- Menu Items (Enhanced Styling) ----------------
function MenuItems() {
  return (
    <nav className="flex flex-col gap-6 mb-3 lg:mb-0 lg:flex-row lg:items-center">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Link
          key={menuItem.id || menuItem.label}
          to={menuItem.path}
          className="text-sm font-semibold transition-all duration-300 hover:text-orange-500 hover:scale-105"
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

// ---------------- Right Side (User) ----------------
function HeaderRightContent({ user }) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const displayName = user?.username || user?.userName || user?.name || "";
  const avatarLetter = displayName?.trim()?.[0]?.toUpperCase() || "U";
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const userId = user?.id || user?._id;
  const totalCartItems =
    cartItems?.items?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <div className="flex items-center gap-4">
      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-orange-500/10 hover:text-orange-500 transition-colors"
          onClick={() => setOpenCartSheet(true)}
        >
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">Open cart</span>
          {totalCartItems > 0 ? (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-lg animate-in fade-in zoom-in">
              {totalCartItems}
            </span>
          ) : null}
        </Button>

        <CartWrapper
          cartItems={cartItems?.items || []}
          setOpenCartSheet={setOpenCartSheet}
        />
      </Sheet>

      {/* Avatar Dropdown with BillaMart Styling */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-zinc-900 border-2 border-orange-600/50 hover:border-orange-600 cursor-pointer transition-all">
            <AvatarFallback className="bg-zinc-900 text-orange-500 font-extrabold">
              {avatarLetter}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="w-56 p-2 border-orange-600/20 shadow-xl">
          <DropdownMenuLabel className="font-bold text-zinc-400">
            Welcome, <span className="text-orange-500">{displayName || "User"}</span>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer focus:bg-orange-500/10 focus:text-orange-500">
            <Link to="/shop/account" className="flex w-full items-center">
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------- Login button for guests ----------------
function GuestLoginButton() {
  return (
    <Button
      asChild
      size="lg"
      className="h-9 bg-orange-600 px-4 font-semibold text-white hover:bg-orange-700"
    >
      <Link to="/auth/login">Login</Link>
    </Button>
  );
}

// ---------------- Main Header (BillaMart UI) ----------------
function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo Section */}
        <Link to="/shop/home" className="flex items-center gap-2 group">
          <div className="p-2 bg-orange-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <HousePlug className="h-6 w-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">
            Billa<span className="text-orange-600">Mart</span>
          </span>
        </Link>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-4 lg:hidden">
            {isAuthenticated ? (
              <HeaderRightContent user={user} />
            ) : (
              <GuestLoginButton />
            )}
            <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-orange-500/10 text-orange-500">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-full max-w-xs border-r-orange-600/20">
                <div className="mt-8">
                    <MenuItems />
                </div>
            </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Right Section (User) for Desktop */}
        <div className="hidden lg:block">
            {isAuthenticated ? (
              <HeaderRightContent user={user} />
            ) : (
              <GuestLoginButton />
            )}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;