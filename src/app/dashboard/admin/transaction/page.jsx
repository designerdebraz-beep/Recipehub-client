"use client";

import React, { useState, useEffect } from 'react';

const Transaction = () => {
    // ডাটাবেজ থেকে আসা ট্রানজেকশন ডাটা রাখার স্টেট
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // ডাটাবেজ থেকে ডাটা নিয়ে আসার ফাংশন
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await fetch("http://localhost:5000/api/admin/transactions");
                const data = await res.json();
                
                if (data.success) {
                    setTransactions(data.data);
                }
            } catch (error) {
                console.error("Error fetching transactions from database:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // আইএসও ডেট ফরম্যাটকে রিডেবল (DD/MM/YYYY) করার হেল্পার ফাংশন
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
    };

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            
            {/* হেডার সেকশন */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                    Transactions <span className="text-2xl">💳</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">All payment records on the platform</p>
            </div>

            {/* ট্রানজেকশন টেবিল কন্টেইনার */}
            <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white">
                            <th className="py-4 px-6 font-medium">User</th>
                            <th className="py-4 px-4 text-center font-medium">Type</th>
                            <th className="py-4 px-4 text-center font-medium">Amount</th>
                            <th className="py-4 px-4 text-center font-medium">Status</th>
                            <th className="py-4 px-4 font-medium">Transaction ID</th>
                            <th className="py-4 px-6 text-center font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium animate-pulse">
                                    Loading secure transactions...
                                </td>
                            </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">
                                    No transactions found in the database.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((txn) => (
                                <tr key={txn._id} className="hover:bg-gray-50/40 transition-colors">
                                    
                                    {/* ইউজার (User Email) */}
                                    <td className="py-4 px-6 text-gray-900 font-bold">
                                        {txn.user || "Unknown User"}
                                    </td>

                                    {/* টাইপ ব্যাজ (Type) */}
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                                            txn.type === "Premium"
                                                ? "bg-purple-50 text-purple-600 border border-purple-100/50"
                                                : "bg-orange-50 text-orange-600 border border-orange-100/50"
                                        }`}>
                                            {txn.type === "Premium" ? "👑 Premium" : "🍳 Recipe"}
                                        </span>
                                    </td>

                                    {/* অ্যামাউন্ট (Amount) */}
                                    <td className="py-4 px-4 text-center text-emerald-600 font-black tracking-tight text-base">
                                        {txn.amount}
                                    </td>

                                    {/* পেমেন্ট স্ট্যাটাস (Payment Status) */}
                                    <td className="py-4 px-4 text-center">
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-0.5 rounded-full text-xs font-bold lowercase">
                                            {txn.status}
                                        </span>
                                    </td>

                                    {/* ট্রানজেকশন আইডি (Transaction ID) */}
                                    <td className="py-4 px-4 text-gray-400 font-mono text-xs">
                                        {txn.txnId}
                                    </td>

                                    {/* তারিখ (Date) */}
                                    <td className="py-4 px-6 text-center text-gray-500 text-xs font-normal">
                                        {formatDate(txn.createdAt)}
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transaction;