'use client'

import React, { useState, useEffect } from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { usePathname } from "next/navigation"; 
import { LogOut, LayoutDashboard, User, Moon, Sun, ChevronRight } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname(); 

  // --- LIVE AUTH STATE WITH LOADING CHECK ---
  // এখানে isPending যুক্ত করা হয়েছে যা লোডিং স্টেট ট্র্যাক করে
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!user;
  console.log(isLoggedIn)

  // Sync initial dark mode setting on load
  useEffect(() => {
    const root = window.document.documentElement;
    const initialDark = root.classList.contains("dark") || localStorage.getItem("theme") === "dark";
    setIsDarkMode(initialDark);
    if (initialDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setIsMenuOpen(false);
  };

  // Shared active pill helper layout for cross-device consistency
  const getLinkClass = (path, isMobile = false) => {
    const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
    if (isMobile) {
      return isActive
        ? "bg-primary/10 text-primary dark:text-primary-400 font-semibold w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all"
        : "text-default-600 dark:text-zinc-400 hover:text-default-900 dark:hover:text-white font-medium w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all hover:bg-default-50 dark:hover:bg-zinc-900/50";
    }
    return isActive 
      ? "bg-default-100 dark:bg-zinc-800 text-default-900 dark:text-white font-semibold px-3 py-2 rounded-xl transition-all text-sm xl:text-base"
      : "text-default-500 hover:text-default-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium px-3 py-2 transition-all text-sm xl:text-base";
  };

  return (
    <div className="w-full fixed top-0 inset-x-0 z-50 flex flex-col shadow-sm">
      
      {/* 🧭 SYSTEM COMPATIBLE NAVBAR CONTAINER */}
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="xl"
        className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-divider/40 h-16 sm:h-20 w-full px-2 sm:px-6 md:px-12 position-relative"
      >
        {/* 📱 MOBILE VIEWPORT BRAND BAR */}
        <NavbarContent className="md:hidden gap-2 sm:gap-4 w-full" justify="start">
          
          {/* 🍔 CUSTOM ANIMATED HAMBURGER BUTTON */}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-default-600 dark:text-zinc-400 h-10 w-10 min-w-[40px] flex items-center justify-center rounded-xl hover:bg-default-100 dark:hover:bg-zinc-900/50 transition-colors"
            icon={(isOpen) => (
              <div className="flex flex-col justify-center items-center w-5 h-5 relative gap-[4px]">
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 transform origin-center ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 transform origin-center ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </div>
            )}
          />
          
          <NavbarBrand as={Link} href="/" className="cursor-pointer select-none items-center gap-2 max-w-fit">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden rounded-lg sm:rounded-xl dark:bg-white bg-black p-1 flex-shrink-0">
              <Image
                width={100}
                height={100}
                src="/Logo.png"
                alt="logo"
                className="object-contain dark:invert"
              />
            </div>
            <p className="font-bold text-base sm:text-xl tracking-tight text-default-900 dark:text-white truncate">
              RecipeHub
            </p>
          </NavbarBrand>
        </NavbarContent>

        {/* 💻 DESKTOP VIEWPORT BRAND BAR */}
        <NavbarContent justify="start" className="hidden md:flex gap-0 max-w-fit flex-shrink-0">
          <NavbarBrand
            as={Link}
            href="/"
            className="cursor-pointer text-default-900 dark:text-white select-none items-center gap-2 lg:gap-3"
          >
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl dark:bg-white p-1 flex-shrink-0">
              <Image
                width={36}
                height={36}
                src="/Logo.png"
                alt="logo"
                className="object-contain dark:invert"
              />
            </div>
            <p className="font-bold text-lg lg:text-xl tracking-tight whitespace-nowrap">
              RecipeHub
            </p>
          </NavbarBrand>
        </NavbarContent>

        {/* 🖥️ MIDDLE LINKS LAYER */}
        <NavbarContent className="hidden md:flex gap-1 lg:gap-2 mx-2" justify="center">
          <NavbarItem>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/browse-products" className={getLinkClass("/browse-products")}>
              Browse Products
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* 🛠️ RIGHT ACTION UTILITY GROUP */}
        <NavbarContent justify="end" className="gap-1.5 sm:gap-3 flex-shrink-0">
          <NavbarItem>
            <Button 
              isIconOnly 
              variant="light" 
              className="text-default-600 dark:text-zinc-400 rounded-full hover:bg-default-100 dark:hover:bg-zinc-800 w-9 h-9 sm:w-10 sm:h-10"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="stroke-[1.5]" />}
            </Button>
          </NavbarItem>

          {/* লোডিং এর সময় UI ব্লিঙ্ক করা বন্ধ করতে কন্ডিশন আপডেট করা হয়েছে */}
          {isPending ? (
            <NavbarItem className="w-10 h-10" /> // ডাটা লোড হওয়ার সময় ফাঁকা জায়গা রাখবে
          ) : isLoggedIn ? (
            <Dropdown placement="bottom-end" backdrop="blur">
              <NavbarItem>
                <DropdownTrigger>
                  <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group select-none py-1 px-1.5 sm:px-2 rounded-xl hover:bg-default-100 dark:hover:bg-zinc-800 transition-colors max-w-[120px] sm:max-w-[200px]">
                    <Avatar src={user?.image} name={user?.name} className="w-7 h-7 sm:w-8 sm:h-8 text-xs object-cover flex-shrink-0" />
                    <span className="text-default-800 dark:text-zinc-200 font-medium text-xs sm:text-sm hidden sm:inline-block truncate">
                      {user?.name}
                    </span>
                  </div>
                </DropdownTrigger>
              </NavbarItem>
              
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="header" className="h-14 gap-2 border-b border-divider/50" textValue="User Context">
                  <p className="text-xs text-default-500">Logged in as</p>
                  <p className="font-semibold text-default-800 dark:text-zinc-200 text-sm truncate">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" startContent={<LayoutDashboard size={16} />} as={Link} href={`/dashboard/${user?.role || 'user'}`}>
                  User Dashboard
                </DropdownItem>
                <DropdownItem key="profile" startContent={<User size={16} />} as={Link} href="/dashboard/profile">
                  My Profile
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger" startContent={<LogOut size={16} />} onClick={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex gap-1.5 sm:gap-2 items-center">
              <NavbarItem>
                <Link href="/login" className="text-xs sm:text-sm font-medium text-default-600 hover:text-default-900 dark:text-zinc-400 dark:hover:text-white transition-colors px-2 py-1">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/signup" size="sm" className="font-medium rounded-xl text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9">
                  Sign Up
                </Button>
              </NavbarItem>
            </div>
          )}
        </NavbarContent>

        {/* 📱 MOBILE NAVIGATION DRAWER OVERLAY */}
        <NavbarMenu className="pt-6 px-4 gap-2 bg-white/98 dark:bg-zinc-950/98 backdrop-blur-lg border-t border-divider/40 top-[calc(var(--navbar-height)+32px)]">
          <NavbarMenuItem>
            <Link 
              href="/" 
              className={getLinkClass("/", true)} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Home</span>
              <ChevronRight size={16} className="text-default-400" />
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link 
              href="/browse-products" 
              className={getLinkClass("/browse-products", true)} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Browse Products</span>
              <ChevronRight size={16} className="text-default-400" />
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link 
              href="/dashboard" 
              className={getLinkClass("/dashboard", true)} 
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Dashboard</span>
              <ChevronRight size={16} className="text-default-400" />
            </Link>
          </NavbarMenuItem>

          <div className="w-full my-2 border-t border-divider/60" />

      

          {/* Mobile Auth Section */}
{isPending ? (
  <div className="h-10" />
) : isLoggedIn ? (
  <>
    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-default-50 dark:bg-zinc-900/50">
      <Avatar
        src={user?.image}
        referrerPolicy="no-referrer"
        name={user?.name}
        className="w-10 h-10 object-cover flex-shrink-0"
      />

      <div className="flex flex-col min-w-0 flex-1">
        <p className="text-sm font-semibold text-default-900 dark:text-white truncate">
          {user?.name}
        </p>
        <p className="text-xs text-default-400 truncate">
          {user?.email}
        </p>
      </div>
    </div>

    <NavbarMenuItem>
      <Link
        href={`/dashboard/${user?.role || "user"}`}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-default-700 dark:text-zinc-300 font-medium text-base hover:bg-default-50 dark:hover:bg-zinc-900/50"
        onClick={() => setIsMenuOpen(false)}
      >
        <LayoutDashboard size={18} className="text-default-500" />
        <span>Dashboard Overview</span>
      </Link>
    </NavbarMenuItem>

    <NavbarMenuItem>
      <Link
        href="/dashboard/profile"
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-default-700 dark:text-zinc-300 font-medium text-base hover:bg-default-50 dark:hover:bg-zinc-900/50"
        onClick={() => setIsMenuOpen(false)}
      >
        <User size={18} className="text-default-500" />
        <span>My Profile Settings</span>
      </Link>
    </NavbarMenuItem>

    <NavbarMenuItem>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger font-medium text-base text-left hover:bg-danger-50 dark:hover:bg-danger-950/20"
      >
        <LogOut size={18} />
        <span>Log Out</span>
      </button>
    </NavbarMenuItem>
  </>
) : (
  <div className="mt-4 flex flex-col gap-2 pt-2">
    <NavbarMenuItem>
      <Link
        href="/login"
        className="w-full text-center block py-3 rounded-xl border border-divider font-medium text-default-700 dark:text-zinc-300 bg-transparent hover:bg-default-50"
        onClick={() => setIsMenuOpen(false)}
      >
        Login
      </Link>
    </NavbarMenuItem>

    <NavbarMenuItem>
      <Button
        as={Link}
        href="/signup"
        color="primary"
        className="w-full py-6 rounded-xl font-medium"
        onClick={() => setIsMenuOpen(false)}
      >
        Sign Up
      </Button>
    </NavbarMenuItem>
  </div>
)}
        </NavbarMenu>
      </Navbar>
    </div>
  );
}