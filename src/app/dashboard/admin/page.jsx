import React from 'react';

const Adminpage = () => {
    // এই ডাটাগুলো পরবর্তীতে ব্যাকএন্ড থেকে ডাইনামিকালি নিয়ে আসতে পারবেন
    const stats = {
        totalUsers: 13,
        totalRecipes: 11,
        premiumMembers: 7,
        pendingReports: 6
    };

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
                        {stats.totalUsers}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Total Users
                    </span>
                </div>

                {/* কার্ড ২: Total Recipes */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">📋</span>
                    <span className="text-4xl font-black text-orange-500 tracking-tight">
                        {stats.totalRecipes}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Total Recipes
                    </span>
                </div>

                {/* কার্ড ৩: Premium Members */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">👑</span>
                    <span className="text-4xl font-black text-purple-600 tracking-tight">
                        {stats.premiumMembers}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mt-2">
                        Premium Members
                    </span>
                </div>

                {/* কার্ড ৪: Pending Reports */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl mb-3">🚨</span>
                    <span className="text-4xl font-black text-red-500 tracking-tight">
                        {stats.pendingReports}
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                        👥 Manage Users
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer">
                        📋 Manage Recipes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Adminpage;