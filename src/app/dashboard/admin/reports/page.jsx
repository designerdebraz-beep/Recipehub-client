"use client";

import React, { useState, useEffect } from 'react';

const Reports = () => {
    // ফিল্টার স্টেট (Pending, Dismissed, All)
    const [activeTab, setActiveTab] = useState("Pending");
    // ডাটাবেজ থেকে আসা রিপোর্টের লিস্ট রাখার স্টেট
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    // ১. ডাটাবেজ থেকে রিপোর্ট লোড করার ফাংশন
    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/reports");
            const data = await res.json();
            if (data.success) {
                setReports(data.data);
            }
        } catch (error) {
            console.error("Error fetching reports from DB:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // ২. রেসিপি রিমুভ করার রিয়েল হ্যান্ডলার (ডাটাবেজ কানেক্টেড)
    const handleRemoveRecipe = async (recipeId) => {
        const confirmRemove = window.confirm(`Are you sure you want to completely remove recipe ${recipeId}? This will delete the recipe and all its reports.`);
        
        if (confirmRemove) {
            try {
                const res = await fetch(`http://localhost:5000/api/recipes/${recipeId}`, {
                    method: "DELETE"
                });
                const data = await res.json();

                if (data.success) {
                    alert("Recipe and its reports removed successfully!");
                    // ডিলিট হওয়ার পর স্টেট থেকে ঐ রেসিপির সব রিপোর্ট ইনস্ট্যান্ট সরিয়ে দেওয়া
                    setReports(reports.filter(report => report.recipeId !== recipeId));
                } else {
                    alert(data.message || "Failed to remove recipe.");
                }
            } catch (error) {
                console.error("Error deleting recipe:", error);
                alert("Server error. Could not delete recipe.");
            }
        }
    };

    // ৩. রিপোর্ট ডিসমিস করার রিয়েল হ্যান্ডলার (ডাটাবেজ কানেক্টেড)
    const handleDismissReport = async (reportId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
                method: "PATCH"
            });
            const data = await res.json();

            if (data.success) {
                alert("Report marked as dismissed.");
                // ইউআই আপডেট করার জন্য লোকাল স্টেট চেঞ্জ করা হলো
                setReports(reports.map(report => {
                    if (report._id === reportId) {
                        return { ...report, status: "dismissed" };
                    }
                    return report;
                }));
            } else {
                alert(data.message || "Failed to dismiss report.");
            }
        } catch (error) {
            console.error("Error dismissing report:", error);
            alert("Server error. Could not dismiss report.");
        }
    };

    // ৪. ট্যাব অনুযায়ী ফিল্টার করা ডাটা (ডাটাবেজের ছোট হাতের অক্ষরের সাথে ম্যাচিং করা হয়েছে)
    const filteredReports = reports.filter(report => {
        if (activeTab === "All") return true;
        return report.status?.toLowerCase() === activeTab.toLowerCase();
    });

    // ৫. আইএসও ডেট ফরম্যাটকে রিডেবল (DD/MM/YYYY) করার হেল্পার ফাংশন
    const formatDate = (dateString) => {
        if (!dateString) return "—";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB"); // Output format: DD/MM/YYYY
    };

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            
            {/* হেডার ও ফিল্টার ট্যাব সেকশন */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                        Recipe Reports <span className="text-2xl">🚨</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {reports.filter(r => r.status?.toLowerCase() === "pending").length} pending reports
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
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium animate-pulse">
                                    Loading reports from database...
                                </td>
                            </tr>
                        ) : filteredReports.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-400 font-medium">
                                    No reports found in this category.
                                </td>
                            </tr>
                        ) : (
                            filteredReports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50/40 transition-colors">
                                    
                                    {/* রেসিপি আইডি */}
                                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                                        {report.recipeId || "—"}
                                    </td>

                                    {/* রিপোর্টার ইমেইল */}
                                    <td className="py-4 px-4 text-gray-900 font-bold">
                                        {report.reporterEmail}
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

                                    {/* বিবরণ (Description / additionalDetails) */}
                                    <td className="py-4 px-4 text-center text-gray-500 font-normal">
                                        {report.additionalDetails || "—"}
                                    </td>

                                    {/* রিপোর্টের তারিখ (Formatted) */}
                                    <td className="py-4 px-4 text-center text-gray-500 text-xs font-normal">
                                        {formatDate(report.createdAt)}
                                    </td>

                                    {/* অ্যাকশন বাটনসমূহ */}
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleRemoveRecipe(report.recipeId)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100/70 text-red-500 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                            >
                                                Remove Recipe
                                            </button>
                                            
                                            {report.status?.toLowerCase() === "pending" && (
                                                <button
                                                    onClick={() => handleDismissReport(report._id)}
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