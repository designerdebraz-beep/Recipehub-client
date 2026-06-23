"use client";

import React, { useState } from 'react';

const Transaction = () => {
    // ইমেজ (image_44ca84.jpg) অনুযায়ী ডামি ট্রানজেকশন ডাটা অ্যারে
    const [transactions, setTransactions] = useState([
        { id: 1, user: "a@gmail.com", type: "Premium", amount: "$9.99", status: "paid", txnId: "cs_test_a1GRXySl...", date: "16/06/2026" },
        { id: 2, user: "a@gmail.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "cs_test_a1xw0HiR...", date: "16/06/2026" },
        { id: 3, user: "a@gmail.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "cs_test_a1XGr0ci...", date: "16/06/2026" },
        { id: 4, user: "a@gmail.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "cs_test_a1RHz2o2...", date: "14/06/2026" },
        { id: 5, user: "a@b.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "cs_test_a10swNF1...", date: "14/06/2026" },
        { id: 6, user: "a@b.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "test_txn_1781447...", date: "14/06/2026" },
        { id: 7, user: "a@b.com", type: "Recipe", amount: "$4.99", status: "paid", txnId: "test_txn_1781447...", date: "14/06/2026" },
        { id: 8, user: "a@b.com", type: "Premium", amount: "$9.99", status: "paid", txnId: "test_txn_premium...", date: "14/06/2026" },
        { id: 9, user: "nusrat.jahan@gmail.com", type: "Recipe", amount: "$0.02", status: "paid", txnId: "pi_3Rq8HiLhY7A1B...", date: "10/04/2026" },
        { id: 10, user: "ayesha.rahman@gmail.com", type: "Recipe", amount: "$0.04", status: "paid", txnId: "pi_3Rq8GhLhY7A1B...", date: "09/04/2026" }
    ]);

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
                        {transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-gray-50/40 transition-colors">
                                
                                {/* ইউজার (User) */}
                                <td className="py-4 px-6 text-gray-900 font-bold">
                                    {txn.user}
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
                                    {txn.date}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transaction;