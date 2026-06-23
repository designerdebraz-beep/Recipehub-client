"use client";

import React, { useState } from 'react';

const Reports = () => {
    // ফিল্টার স্টেট (Pending, Dismissed, All)
    const [activeTab, setActiveTab] = useState("Pending");

    // ইমেজ (image_44bf5f.jpg) অনুযায়ী ডামি রিপোর্টের ডাটা অ্যারে
    const [reports, setReports] = useState([
        { id: 1, recipeId: "00000006...", reporter: "a@gmail.com", reason: "Offensive Content", description: "—", date: "16/06/2026", status: "Pending" },
        { id: 2, recipeId: "00000009...", reporter: "a@gmail.com", reason: "Spam", description: "Offensive", date: "14/06/2026", status: "Pending" },
        { id: 3, recipeId: "00000001...", reporter: "tanvir.ahmed@gmail.com", reason: "Spam", description: "—", date: "10/05/2026", status: "Pending" },
        { id: 4, recipeId: "00000010...", reporter: "mehedi.hasan@gmail.com", reason: "Spam", description: "—", date: "07/05/2026", status: "Pending" },
        { id: 5, recipeId: "00000002...", reporter: "sabbir.hossain@gmail.com", reason: "Spam", description: "—", date: "04/05/2026", status: "Pending" },
        { id: 6, recipeId: "00000007...", reporter: "tanvir.ahmed@gmail.com", reason: "Spam", description: "—", date: "01/05/2026", status: "Pending" },
    ]);

    // রেসিপি রিমুভ করার হ্যান্ডলার
    const handleRemoveRecipe = (id, recipeId) => {
        const confirmRemove = window.confirm(`Are you sure you want to remove recipe ${recipeId}?`);
        if (confirmRemove) {
            setReports(reports.filter(report => report.id !== id));
            alert("Recipe removed successfully!");
        }
    };

    // রিপোর্ট ডিসমিস করার হ্যান্ডলার
    const handleDismissReport = (id) => {
        setReports(reports.map(report => {
            if (report.id === id) {
                return { ...report, status: "Dismissed" };
            }
            return report;
        }));
        alert("Report dismissed.");
    };

    // ট্যাব অনুযায়ী ফিল্টার করা ডাটা
    const filteredReports = reports.filter(report => {
        if (activeTab === "All") return true;
        return report.status === activeTab;
    });

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            
            {/* হেডার ও ফিল্টার ট্যাব সেকশন */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                        Recipe Reports <span className="text-2xl">🚨</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {reports.filter(r => r.status === "Pending").length} pending reports
                    </p>
                </div>

                {/* ফিল্টার ট্যাব বাটনসমূহ */}
                <div className="flex items-center gap-1 bg-white p-1.5 border border-gray-100 rounded-xl shadow-sm self-start sm:self-center">
                    {["Pending", "Dismissed", "All"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                                activeTab === tab
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* রিপোর্ট টেবিল কন্টেইনার */}
            <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white">
                            <th className="py-4 px-6 font-medium">Recipe ID</th>
                            <th className="py-4 px-4 font-medium">Reporter</th>
                            <th className="py-4 px-4 text-center font-medium">Reason</th>
                            <th className="py-4 px-4 text-center font-medium">Description</th>
                            <th className="py-4 px-4 text-center font-medium">Reported</th>
                            <th className="py-4 px-6 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">
                                    No reports found in this category.
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50/40 transition-colors">
                                    
                                    {/* রেসিপি আইডি */}
                                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                                        {report.recipeId}
                                    </td>

                                    {/* রিপোর্টার ইমেইল */}
                                    <td className="py-4 px-4 text-gray-900 font-bold">
                                        {report.reporter}
                                    </td>

                                    {/* রিপোর্টের কারণ (Reason) */}
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                            report.reason === "Offensive Content"
                                                ? "bg-red-50 text-red-600 border-red-100/50"
                                                : "bg-orange-50 text-orange-600 border-orange-100/50"
                                        }`}>
                                            {report.reason}
                                        </span>
                                    </td>

                                    {/* বিবরণ (Description) */}
                                    <td className="py-4 px-4 text-center text-gray-500 font-normal">
                                        {report.description}
                                    </td>

                                    {/* রিপোর্টের তারিখ */}
                                    <td className="py-4 px-4 text-center text-gray-500 text-xs font-normal">
                                        {report.date}
                                    </td>

                                    {/* অ্যাকশন বাটনসমূহ */}
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleRemoveRecipe(report.id, report.recipeId)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100/70 text-red-500 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                            >
                                                Remove Recipe
                                            </button>
                                            
                                            {report.status === "Pending" && (
                                                <button
                                                    onClick={() => handleDismissReport(report.id)}
                                                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Dismiss
                                                </button>
                                            )}
                                        </div>
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

export default Reports;