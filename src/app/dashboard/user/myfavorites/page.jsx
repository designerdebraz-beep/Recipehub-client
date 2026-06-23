"use client";

import React, { useEffect, useState } from 'react';
import { authClient } from "@/lib/auth-client";
import Image from 'next/image';
import Link from 'next/link';

// ডিলিট/ট্রাশ আইকন কম্পোনেন্ট
const TrashIcon = ({ className = "size-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const Myfavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const session = await authClient.getSession();
                const userId = session?.data?.user?.id;

                if (!userId) {
                    setLoading(false);
                    return;
                }

                // ইউজার আইডি অনুযায়ী ফেভারিট ডাটা আনা হচ্ছে
                const res = await fetch(`http://localhost:5000/api/favorites/${userId}`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setFavorites(data);
                } else {
                    setFavorites([]);
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setFavorites([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    // ফেভারিট লিস্ট থেকে রিমুভ করার হ্যান্ডলার
    const handleRemoveFavorite = async (recipeId) => {
        const session = await authClient.getSession();
        const userId = session?.data?.user?.id;

        if (!userId) return;

        // ইউজার কনফার্মেশন (ঐচ্ছিক)
        const proceed = window.confirm("Are you sure you want to remove this from favorites?");
        if (!proceed) return;

        try {
            // ব্যাকএন্ডের POST টগল এপিআই ব্যবহার করা হচ্ছে
            const res = await fetch("http://localhost:5000/api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userId,
                    recipeId: recipeId
                })
            });

            const data = await res.json();

            if (res.ok && !data.isFavorite) {
                // সফলভাবে ডিলিট হলে ফ্রন্টএন্ড স্টেট থেকে সাথে সাথে রিমুভ করে দেওয়া হচ্ছে
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.recipeId !== recipeId));
                alert(data.message || "Removed successfully!");
            } else {
                alert("Could not remove from favorites.");
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            alert("Failed to connect to the server.");
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20 text-gray-500 font-medium">Loading Favorites...</div>;
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <h2 className="text-2xl font-bold mb-2">No Favorites Saved Yet! 🌟</h2>
                <p className="text-sm text-gray-400">Explore recipes and hit the star button to save them here.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
                My Favorites <span className="text-2xl">⭐</span>
            </h1>
            <p className="text-gray-500 text-sm mb-8">{favorites.length} recipes saved in your collection</p>

            {/* ফেভারিট রেসিপি গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((fav) => (
                    <div key={fav._id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col group relative">
                        
                        {/* ডিলিট বাটন (ইমেজের ওপরে ডান কোনায় ভাসমান থাকবে) */}
                        <button 
                            onClick={() => handleRemoveFavorite(fav.recipeId)}
                            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-xl border border-gray-100 shadow-sm backdrop-blur-sm transition-colors"
                            title="Remove from favorites"
                        >
                            <TrashIcon className="size-4.5" />
                        </button>
                        
                        {/* ইমেজ সেকশন */}
                        <div className="relative aspect-[4/3] w-full bg-gray-100">
                            <Image 
                                src={fav.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"} 
                                alt={fav.recipeName} 
                                fill 
                                className="object-cover"
                            />
                            {fav.category && (
                                <span className="absolute top-3 left-3 bg-white/90 text-gray-800 text-[11px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                    {fav.category}
                                </span>
                            )}
                        </div>

                        {/* ইনফো সেকশন */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1">{fav.recipeName}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                    <span>{fav.cuisineType || "International"}</span>
                                    <span>•</span>
                                    <span className="text-emerald-600 font-semibold">{fav.difficultyLevel || "Easy"}</span>
                                </div>
                            </div>

                            {/* ভিউ বাটন যা ডিটেইলস পেজে নিয়ে যাবে */}
                            <Link href={`/recipes/${fav.recipeId}`} className="w-full">
                                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-center py-2.5 rounded-xl text-xs font-bold transition-colors">
                                    View Full Recipe
                                </button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Myfavorites;