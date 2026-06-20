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
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!user;

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
        ? "bg-primary/10 text-primary dark:text-primary-400 font-semibold w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all text-sm"
        : "text-default-600 dark:text-zinc-400 hover:text-default-900 dark:hover:text-white font-medium w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all hover:bg-default-50 dark:hover:bg-zinc-900/40 text-sm";
    }
    return isActive
      ? "bg-default-100 dark:bg-zinc-800 text-default-900 dark:text-white font-semibold px-3 py-2 rounded-xl transition-all text-sm"
      : "text-default-500 hover:text-default-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium px-3 py-2 rounded-xl transition-all text-sm";
  };

  return (
    <div className="w-full fixed top-0 inset-x-0 z-50 flex flex-col">
      {/* 🧭 PREMIUM GLASSMORPHISM NAVBAR */}
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="xl"
        className="bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-default-200/50 dark:border-zinc-800/50 h-16 sm:h-20 w-full transition-colors duration-300"
      >
        {/* 📱 MOBILE VIEWPORT BRAND BAR */}
        <NavbarContent className="md:hidden gap-3 w-full" justify="start">
          {/* 🍔 CUSTOM ANIMATED HAMBURGER BUTTON */}
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-default-600 dark:text-zinc-400 h-10 w-10 flex items-center justify-center rounded-xl hover:bg-default-100 dark:hover:bg-zinc-900/50 transition-colors"
            icon={(isOpen) => (
              <div className="flex flex-col justify-center items-center w-5 h-5 relative gap-[4px]">
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 transform origin-center ${isOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <span className={`bg-current h-[2px] w-5 rounded-full transition-all duration-300 transform origin-center ${isOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
              </div>
            )}
          />

          <NavbarBrand as={Link} href="/" className="cursor-pointer select-none items-center gap-2 max-w-fit">
            <div className="relative w-5xl h-5xl flex items-center justify-center overflow-hidden rounded-xl  dark:bg-white p-1.5 transition-colors">
              <Image
                width={200}
                height={200}
                src="/Logo.png"
                alt="logo"
                className="object-contain dark:invert"
              />
            </div>
            <p className="font-bold text-base tracking-tight text-default-900 dark:text-white truncate">
              RecipeHub
            </p>
          </NavbarBrand>
        </NavbarContent>

        {/* 💻 DESKTOP VIEWPORT BRAND BAR */}
        <NavbarContent justify="start" className="hidden md:flex gap-0 max-w-fit">
          <NavbarBrand
            as={Link}
            href="/"
            className="cursor-pointer text-default-900 dark:text-white select-none items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl dark:bg-white p-1.5 transition-colors">
              <Image
                width={100}
                height={100}
                src="/Logo.png"
                alt="logo"
                className="object-contain dark:invert"
              />
            </div>
            <p className="font-extrabold text-lg lg:text-xl tracking-tight whitespace-nowrap">
              RecipeHub
            </p>
          </NavbarBrand>
        </NavbarContent>

        {/* 🖥️ MIDDLE LINKS LAYER */}
        <NavbarContent className="hidden md:flex gap-2 mx-6" justify="center">
          <NavbarItem>
            <Link href="/" className={getLinkClass("/")}>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/recipes" className={getLinkClass("/recipes")}>
             Browse Recipes
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href={`/dashboard/${user?.role}`} className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
           
          </NavbarItem>
        </NavbarContent>

        {/* 🛠️ RIGHT ACTION UTILITY GROUP */}
        <NavbarContent justify="end" className="gap-2 sm:gap-3">
          {/* Theme Toggler */}
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="text-default-600 dark:text-zinc-400 rounded-xl hover:bg-default-100 dark:hover:bg-zinc-800/60 w-10 h-10 transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-500 animate-pulse" /> : <Moon size={18} className="stroke-[1.5]" />}
            </Button>
          </NavbarItem>

          {/* Skeleton/Auth State Loader */}
          {isPending ? (
            <NavbarItem className="w-10 h-10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-default-200 dark:bg-zinc-800 animate-pulse" />
            </NavbarItem>
          ) : isLoggedIn ? (
            <Dropdown placement="bottom-end" backdrop="blur" className="bg-white dark:bg-zinc-900 border border-default-100 dark:border-zinc-800 rounded-2xl shadow-xl">
              <NavbarItem>
                <DropdownTrigger>
                  <div className="flex items-center gap-2 cursor-pointer group select-none py-1.5 pl-1.5 pr-2.5 sm:pr-3 rounded-xl bg-default-50/50 hover:bg-default-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/80 border border-default-200/30 dark:border-zinc-800/30 transition-all max-w-[140px] sm:max-w-[200px]">
                    <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-default-200/60 dark:border-zinc-700">
                      <Avatar.Image src={user?.image}
                        referrerPolicy="no-referrer"
                        name={user?.name}
                        className="object-cover" />
                      <Avatar.Fallback className="text-xs">{user?.name?.charAt(0)}</Avatar.Fallback>
                    </Avatar>
                    <span className="text-default-800 dark:text-zinc-200 font-semibold text-xs sm:text-sm hidden sm:inline-block truncate group-hover:text-default-900 dark:group-hover:text-white transition-colors">
                      {user?.name}
                    </span>
                  </div>
                </DropdownTrigger>
              </NavbarItem>

              <DropdownMenu aria-label="User Actions" variant="flat" className="p-1.5">
                <DropdownItem key="header" className="h-14 gap-2 border-b border-default-100 dark:border-zinc-800 mb-1 opacity-100 pointer-events-none" textValue="User Context">
                  <p className="text-[11px] text-default-400 uppercase tracking-wider font-bold">Logged in as</p>
                  <p className="font-semibold text-default-700 dark:text-zinc-300 text-xs sm:text-sm truncate">{user?.email}</p>
                </DropdownItem>
                <DropdownItem key="dashboard" startContent={<LayoutDashboard size={15} className="text-default-500" />} as={Link} href={`/dashboard/${user?.role || 'user'}`} className="rounded-xl py-2">
                  User Dashboard
                </DropdownItem>
                <DropdownItem key="profile" startContent={<User size={15} className="text-default-500" />} as={Link} href={`/dashboard/${user?.role}`} className="rounded-xl py-2">
                  My Profile
                </DropdownItem>
                <DropdownItem key="logout" color="danger" className="text-danger rounded-xl py-2 mt-1 bg-danger-50/50 hover:bg-danger/10" startContent={<LogOut size={15} />} onClick={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <div className="flex gap-2 items-center">
              <NavbarItem>
                <Link href="/login" className="text-sm font-semibold text-default-600 hover:text-[#ff6b6b] dark:text-zinc-400 dark:hover:text-[#ff6b6b] transition-colors px-2 py-2">
                  Login
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/signup" size="sm" className="font-bold rounded-xl text-xs sm:text-sm px-4 h-9 bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm shadow-danger-500/10 active:scale-[0.98] transition-all">
                  Sign Up
                </Button>
              </NavbarItem>
            </div>
          )}
        </NavbarContent>

        {/* 📱 MOBILE NAVIGATION DRAWER OVERLAY */}
        <NavbarMenu className="pt-6 px-4 gap-2 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-default-100 dark:border-zinc-900 top-[calc(var(--navbar-height))] max-h-[calc(100vh-var(--navbar-height))] overflow-y-auto transition-all">
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
              href="/recipes"
              className={getLinkClass("/recipes", true)}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Browse Recipes</span>
              <ChevronRight size={16} className="text-default-400" />
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem>
            <Link
              href={`/dashboard/${user?.role}`}
              className={getLinkClass("/dashboard", true)}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Dashboard</span>
              <ChevronRight size={16} className="text-default-400" />
            </Link>
          
          </NavbarMenuItem>

          <div className="w-full my-2 border-t border-default-200/60 dark:border-zinc-800/60" />

          {/* Mobile Auth Section */}
          {isPending ? (
            <div className="h-10 flex items-center px-4">
              <div className="w-6 h-6 rounded-full bg-default-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          ) : isLoggedIn ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-default-50 dark:bg-zinc-900/40 border border-default-200/40 dark:border-zinc-800/40 mx-1">
                <Avatar className="w-9 h-9 border border-default-200/60 dark:border-zinc-700">
                  <Avatar.Image src={user?.image}
                    referrerPolicy="no-referrer"
                    name={user?.name}
                    className="object-cover" />
                  <Avatar.Fallback>{user?.name?.charAt(0)}</Avatar.Fallback>
                </Avatar>

                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-bold text-default-900 dark:text-white truncate">
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-default-700 dark:text-zinc-300 font-medium text-sm hover:bg-default-50 dark:hover:bg-zinc-900/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={16} className="text-default-400" />
                  <span>Dashboard Overview</span>
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <Link
                  href="/dashboard/profile"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-default-700 dark:text-zinc-300 font-medium text-sm hover:bg-default-50 dark:hover:bg-zinc-900/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={16} className="text-default-400" />
                  <span>My Profile Settings</span>
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger font-semibold text-sm text-left hover:bg-danger-50 dark:hover:bg-danger-950/20"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </NavbarMenuItem>
            </>
          ) : (
            <div className="mt-2 flex flex-col gap-2.5 px-1">
              <NavbarMenuItem>
                <Link
                  href="/login"
                  className="w-full text-center block py-3 rounded-xl border border-default-200 dark:border-zinc-800 font-semibold text-sm text-default-700 dark:text-zinc-300 bg-transparent hover:bg-default-50 dark:hover:bg-zinc-900/40 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </NavbarMenuItem>

              <NavbarMenuItem>
                <Button
                  as={Link}
                  href="/signup"
                  className="w-full py-5 rounded-xl font-bold text-sm bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-sm"
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