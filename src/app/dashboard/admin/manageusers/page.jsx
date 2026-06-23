"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const Manageusers = () => {
    // স্ক্রিনশটের সাথে মিল রেখে ডামি ইউজার ডাটা অ্যারে
    const [users, setUsers] = useState([
        { id: 1, name: "Admin", email: "admin@gmail.com", role: "Admin", premium: "Free", status: "Active", joined: "16/05/2026", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" },
        { id: 2, name: "Abc", email: "a@gmail.com", role: "User", premium: "Premium", status: "Active", joined: "14/06/2026", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
        { id: 3, name: "Nasib", email: "a@b.com", role: "Admin", premium: "Premium", status: "Active", joined: "14/06/2026", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100" },
        { id: 4, name: "Mehedi Hasan", email: "mehedi.hasan@gmail.com", role: "Admin", premium: "Free", status: "Active", joined: "20/01/2026", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100" },
        { id: 5, name: "Sadia Noor", email: "sadia.noor@gmail.com", role: "User", premium: "Premium", status: "Active", joined: "18/01/2026", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" },
        { id: 6, name: "Rafi Islam", email: "rafi.islam@gmail.com", role: "User", premium: "Free", status: "Blocked", joined: "16/01/2026", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100" },
        { id: 7, name: "Sabbir Hossain", email: "sabbir.hossain@gmail.com", role: "User", premium: "Free", status: "Active", joined: "12/01/2026", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100" },
        { id: 8, name: "Mim Akter", email: "mim.akter@gmail.com", role: "User", premium: "Premium", status: "Active", joined: "10/01/2026", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100" },
    ]);

    // ব্লক বা আনব্লক করার হ্যান্ডলার
    const toggleBlockStatus = (id) => {
        setUsers(users.map(user => {
            if (user.id === id) {
                return {
                    ...user,
                    status: user.status === "Active" ? "Blocked" : "Active"
                };
            }
            return user;
        }));
    };

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            {/* হেডার সেকশন */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                    Manage Users <span className="text-2xl">👥</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Block/unblock users and manage roles</p>
            </div>

            {/* ইউজার টেবিল কন্টেইনার */}
            <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white">
                            <th className="py-4 px-6 font-medium">User</th>
                            <th className="py-4 px-4 font-medium text-center">Role</th>
                            <th className="py-4 px-4 font-medium text-center">Premium</th>
                            <th className="py-4 px-4 font-medium text-center">Status</th>
                            <th className="py-4 px-4 font-medium text-center">Joined</th>
                            <th className="py-4 px-6 font-medium text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                                {/* ইউজার প্রোফাইল ও ইমেইল */}
                                <td className="py-4 px-6 flex items-center gap-4">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                        <Image 
                                            src={user.avatar} 
                                            alt={user.name} 
                                            fill 
                                            className="object-cover"
                                            sizes="40px"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{user.name}</h3>
                                        <span className="text-xs text-gray-400 font-normal">{user.email}</span>
                                    </div>
                                </td>

                                {/* রোল ব্যাজ (Admin/User) */}
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                                        user.role === "Admin" 
                                            ? "bg-purple-50 text-purple-600 border border-purple-100" 
                                            : "bg-blue-50 text-blue-600 border border-blue-100"
                                    }`}>
                                        {user.role === "Admin" ? "🛡️ Admin" : "👤 User"}
                                    </span>
                                </td>

                                {/* প্রিমিয়াম স্ট্যাটাস */}
                                <td className="py-4 px-4 text-center">
                                    {user.premium === "Premium" ? (
                                        <span className="bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                                            👑 Premium
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs font-normal">Free</span>
                                    )}
                                </td>

                                {/* একটিভ/ব্লকড স্ট্যাটাস */}
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                        user.status === "Active" 
                                            ? "bg-emerald-50 text-emerald-600" 
                                            : "bg-red-50 text-red-600"
                                    }`}>
                                        {user.status === "Active" ? "✓ Active" : "🚫 Blocked"}
                                    </span>
                                </td>

                                {/* জয়েনিং ডেট */}
                                <td className="py-4 px-4 text-center text-gray-500 text-xs font-normal">
                                    {user.joined}
                                </td>

                                {/* অ্যাকশন বাটনসমূহ (Block/Unblock) */}
                                <td className="py-4 px-6 text-center">
                                    <button 
                                        onClick={() => toggleBlockStatus(user.id)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                            user.status === "Active"
                                                ? "bg-red-50 text-red-500 hover:bg-red-100/70"
                                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100/70"
                                        }`}
                                    >
                                        {user.status === "Active" ? "Block" : "Unblock"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Manageusers;