"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';

const Adminpage = () => {
    // ডাটাবেজ থেকে আসা ডাটা রাখার জন্য স্টেট
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecipes: 0,
        premiumMembers: 0,
        pendingReports: 0
    });
    const [loading, setLoading] = useState(true);

    // পেজ লোড হওয়ার সময় ব্যাকএন্ড থেকে ডাটা ফেচ করা
    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/admin-stats");
                const data = await res.json();
                
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            {/* হেডার সেকশন */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                    Admin Overview <span className="text-2xl">🛡️</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Platform statistics and management</p>
            </div>

            {/* ৪টি স্ট্যাটস কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* কার্ড ১: Total Users */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">👥</span>
                    <span className="text-4xl font-black text-blue-600 tracking-tight">
                        {loading ? "..." : stats.totalUsers}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Total Users
                    </span>
                </div>

                {/* কার্ড ২: Total Recipes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">📋</span>
                    <span className="text-4xl font-black text-orange-500 tracking-tight">
                        {loading ? "..." : stats.totalRecipes}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Total Recipes
                    </span>
                </div>

                {/* কার্ড ৩: Premium Members */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">👑</span>
                    <span className="text-4xl font-black text-purple-600 tracking-tight">
                        {loading ? "..." : stats.premiumMembers}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Premium Members
                    </span>
                </div>

                {/* কার্ড ৪: Pending Reports */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">🚨</span>
                    <span className="text-4xl font-black text-red-500 tracking-tight">
                        {loading ? "..." : stats.pendingReports}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Pending Reports
                    </span>
                </div>

            </div>

            {/* কুইক অ্যাকশনস সেকশন */}
            <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 mb-4 tracking-tight">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                   <Link href='/dashboard/admin/manageusers'>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                        👥 Manage Users
                    </button>
                   </Link>
                   <Link href='/dashboard/admin/managerecipes'>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                        📋 Manage Recipes
                    </button>
                   </Link>
                </div>
            </div>
        </div>
    );
};

export default Adminpage;