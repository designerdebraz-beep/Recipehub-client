import React from 'react';
import { Link } from "@heroui/link"; 
import Image from "next/image";
// lucide.dev এর অফিশিয়াল ডকুমেন্টেশন অনুযায়ী সঠিক আইকন নামগুলো ইম্পোর্ট করা হলো
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-default-50 dark:bg-zinc-950 border-t border-divider/40 text-default-600 dark:text-zinc-400 transition-colors">
            {/* 🌐 MAIN CONTAINER */}
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
                
                {/* 📊 GRID LAYOUT */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
                    
                    {/* 1. LOGO & BRAND DESCRIPTION */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 max-w-fit select-none">
                            <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden rounded-xl dark:bg-white bg-black p-1 flex-shrink-0">
                                <Image
                                    width={32}
                                    height={32}
                                    src="/Logo.png"
                                    alt="logo"
                                    className="object-contain dark:invert"
                                />
                            </div>
                            <p className="font-bold text-xl tracking-tight text-default-900 dark:text-white">
                                RecipeHub
                            </p>
                        </Link>
                        <p className="text-sm leading-relaxed text-default-500 dark:text-zinc-500">
                            Discover, create, and share your favorite recipes online. Join our digital kitchen community today.
                        </p>
                    </div>

                    {/* 2. QUICK LINKS */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold tracking-wider text-default-900 dark:text-white uppercase">
                            Quick Links
                        </h3>
                        <ul className="flex flex-col gap-2.5 text-sm">
                            <li>
                                <Link href="/" className="hover:text-primary dark:hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/browse-products" className="hover:text-primary dark:hover:text-primary-400 transition-colors">
                                    Browse Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-primary dark:hover:text-primary-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 3. CONTACT INFORMATION */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold tracking-wider text-default-900 dark:text-white uppercase">
                            Contact Info
                        </h3>
                        <ul className="flex flex-col gap-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <MapPin size={18} className="text-default-400 flex-shrink-0 mt-0.5" />
                                <span>123 Culinary Street, Food Suite 404, Kitchen City</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone size={18} className="text-default-400 flex-shrink-0" />
                                <a href="tel:+1234567890" className="hover:text-default-900 dark:hover:text-white transition-colors">
                                    +1 (234) 567-890
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail size={18} className="text-default-400 flex-shrink-0" />
                                <a href="mailto:support@recipehub.com" className="hover:text-default-900 dark:hover:text-white transition-colors">
                                    support@recipehub.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 4. SOCIAL LINKS */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold tracking-wider text-default-900 dark:text-white uppercase">
                            Follow Us
                        </h3>
                        <p className="text-sm text-default-500 dark:text-zinc-500 mb-1">
                            Stay connected for daily cooking inspiration and fresh updates.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-default-100 hover:bg-default-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-default-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all" aria-label="Facebook">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-default-100 hover:bg-default-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-default-600 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all" aria-label="Twitter">
                                <FaTwitter size={18} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-default-100 hover:bg-default-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-default-600 dark:text-zinc-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all" aria-label="Instagram">
                                <FaInstagram size={18} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-default-100 hover:bg-default-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-default-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-all" aria-label="Youtube">
                                <FaYoutube size={18} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* ☕ DIVIDER & COPYRIGHT */}
                <div className="mt-12 pt-8 border-t border-divider/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-default-400 dark:text-zinc-500">
                    <p>&copy; {currentYear} RecipeHub. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-default-600 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-default-600 dark:hover:text-zinc-300 transition-colors">Terms of Service</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;