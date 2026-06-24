"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Manageusers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState("Admin"); // সেশন বা কনটেক্সট থেকে আসবে

    // ব্যাকএন্ড বেস ইউআরএল (আপনার এক্সপ্রেস সার্ভারের পোর্ট)
    const BASE_URL = "http://localhost:5000";

    // ১. ইউজার কালেকশন থেকে সমস্ত ইউজারের ডেটা ফেচ করা
    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                // আপনার ব্যাকএন্ড এপিআই পাথ ছিল /api/users (s সহ)
                const response = await fetch(`${BASE_URL}/api/users`);
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };

        fetchUsersData();
    }, []);

    // ২. নির্দিষ্ট ইউজারকে ব্লক বা আনব্লক করার হ্যান্ডলার
    const toggleBlockStatus = async (userId, currentStatus) => {
        if (currentUserRole !== "Admin") {
            alert("শুধুমাত্র Admin-রাই ইউজারদের ব্লক বা আনব্লক করতে পারবেন!");
            return;
        }

        const newStatus = currentStatus === "Active" ? "Blocked" : "Active";

        try {
            // সঠিক পোর্টে PATCH রিকোয়েস্ট পাঠানো
            const response = await fetch(`${BASE_URL}/api/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                alert(`User status updated to ${newStatus}`);

                // ক্লায়েন্ট সাইড স্টেটে ইউজারের স্ট্যাটাস সাথে সাথে রিয়েল-টাইম আপডেট করা
                setUsers(prevUsers =>
                    prevUsers.map(user => {
                        const id = user._id?.$oid || user._id;
                        if (id === userId) {
                            return { ...user, status: newStatus };
                        }
                        return user;
                    })
                );
            } else {
                alert("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F8F9FA]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            {/* হেডার সেকশন */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                    Manage Users <span className="text-2xl">👥</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Block/unblock users and manage platform roles</p>
            </div>

            {/* টেবিল কন্টেইনার */}
            <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white">
                            <th className="py-4 px-6 font-medium">User</th>
                            <th className="py-4 px-4 font-medium">Role</th>
                            <th className="py-4 px-4 font-medium">Premium</th>
                            <th className="py-4 px-4 text-center font-medium">Status</th>
                            <th className="py-4 px-4 text-center font-medium">Joined</th>
                            <th className="py-4 px-6 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {users.map((user) => {
                            // মঙ্গোডিবি আইডির স্ট্রাকচার হ্যান্ডেল করা
                            const userId = user._id?.$oid || user._id || "";
                            const userStatus = user.status || "Active";

                            return (
                                <tr key={userId} className="hover:bg-gray-50/40 transition-colors">

                                    {/* ইউজার ইমেজ, নাম ও ইমেইল */}
                                    <td className="py-4 px-6 flex items-center gap-4">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                            <Image
                                                src={user.image || "https://i.ibb.co/rKT51VdX/egg-omelette.jpg"}
                                                alt={user.name || "User"}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 capitalize">{user.name || "Anonymous"}</h3>
                                            <span className="text-xs text-gray-400 font-normal">{user.email}</span>
                                        </div>
                                    </td>

                                    {/* রোল (Admin / User) */}
                                    <td className="py-4 px-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === "Admin" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                                            }`}>
                                            🛡️ {user.role || "User"}
                                        </span>
                                    </td>

                                   
                                    {/* প্রিমিয়াম মেম্বারশিপ স্ট্যাটাস */}
                                    <td className="py-4 px-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.plan === "pro" ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-500"
                                            }`}>
                                            {user.plan === "pro" ? "👑 Premium" : "Free"}
                                        </span>
                                    </td>

                                    {/* একটিভ/ব্লকড স্ট্যাটাস */}
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${userStatus === "Active"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-red-50 text-red-600"
                                            }`}>
                                            {userStatus === "Active" ? "✓ Active" : "🚫 Blocked"}
                                        </span>
                                    </td>

                                    {/* জয়েন করার তারিখ */}
                                    <td className="py-4 px-4 text-center text-gray-500 text-xs font-normal">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "N/A"}
                                    </td>

                                    {/* অ্যাকশন বাটন (Block/Unblock) */}
                                    <td className="py-4 px-6 text-center">
                                        <button
                                            onClick={() => toggleBlockStatus(userId, userStatus)}
                                            disabled={currentUserRole !== "Admin"}
                                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${currentUserRole !== "Admin"
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : userStatus === "Active"
                                                        ? "bg-red-50 text-red-500 hover:bg-red-100/70 cursor-pointer"
                                                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100/70 cursor-pointer"
                                                }`}
                                        >
                                            {userStatus === "Active" ? "Block" : "Unblock"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Manageusers;