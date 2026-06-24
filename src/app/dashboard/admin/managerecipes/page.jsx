"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Managerecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    // console.log(recipes)

    // আপনার রিয়েল এক্সপ্রেস সার্ভারের পোর্ট বা রুট (প্রয়োজনে পরিবর্তন করে নেবেন)
    const BASE_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL; 

    // ১. ব্যাকএন্ড থেকে রেসিপি ডেটা ফেচ করা
    const fetchRecipes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/recipes`);
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setRecipes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    // আইডি পার্স করার হেল্পার ফাংশন (MongoDB string/object safe করার জন্য)
    const getRecipeId = (recipe) => {
        if (!recipe) return "";
        if (typeof recipe._id === 'object' && recipe._id?.$oid) return recipe._id.$oid;
        return recipe._id;
    };

    // ২. ফিচারড স্ট্যাটাস টগল হ্যান্ডলার
    const toggleFeatureStatus = async (id, currentStatus) => {
        const updatedStatus = !currentStatus;

        try {
            const response = await fetch(`${BASE_URL}/api/recipes/${id}/feature`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: updatedStatus }),
            });

            if (response.ok) {
                setRecipes(prevRecipes =>
                    prevRecipes.map(recipe => {
                        if (getRecipeId(recipe) === id) {
                            return { ...recipe, isFeatured: updatedStatus };
                        }
                        return recipe;
                    })
                );
            } else {
                alert("Featured স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।");
            }
        } catch (error) {
            console.error("Error updating feature status:", error);
        }
    };

    

    // ৩. রেসিপি ডিলিট হ্যান্ডলার
    const handleDeleteRecipe = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/api/recipes/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert("Recipe deleted successfully");
                setRecipes(prevRecipes => 
                    prevRecipes.filter(recipe => getRecipeId(recipe) !== id)
                );
            } else {
                alert("রেসিপি ডিলিট করা যায়নি।");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
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
                    Manage Recipes <span className="text-2xl">📋</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Delete recipes or toggle featured status</p>
            </div>

            {/* যদি কোনো ডাটা লোড না হয় বা কালেকশন ফাকা থাকে */}
            {recipes.length === 0 ? (
                <div className="w-full p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-gray-500 font-medium text-lg">No recipes found in database! 🍲</p>
                </div>
            ) : (
                /* রেসিপি টেবিল কন্টেইনার */
                <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-left border-collapse min-w-[950px]">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-white">
                                <th className="py-4 px-6 font-medium">Recipe</th>
                                <th className="py-4 px-4 font-medium">Author</th>
                                <th className="py-4 px-4 text-center font-medium">Category</th>
                                <th className="py-4 px-4 text-center font-medium">Likes</th>
                                <th className="py-4 px-4 text-center font-medium">Featured</th>
                                <th className="py-4 px-6 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                            {recipes.map((recipe) => {
                                const recipeId = getRecipeId(recipe);
                                const authorName = recipe.authorDetails?.name || "Unknown User";
                                const authorEmail = recipe.authorDetails?.email || "No Email";
                                const totalLikes = recipe.likesCount && recipe.likesCount > 0 ? recipe.likesCount : 0;

                                return (
                                    <tr key={recipeId} className="hover:bg-gray-50/40 transition-colors">
                                        
                                        {/* রেসিপি ইমেজ ও নাম */}
                                        <td className="py-4 px-6 flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                <Image 
                                                    src={recipe.imageUrl || "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=150"} 
                                                    alt={recipe.recipeName || "Recipe"} 
                                                    fill 
                                                    className="object-cover"
                                                    sizes="48px"
                                                    unoptimized // ইমেজের এক্সটার্নাল ডোমেইন এরর এড়াতে এটি যোগ করতে পারেন
                                                />
                                            </div>
                                            <span className="font-bold text-gray-900 capitalize">{recipe.recipeName}</span>
                                        </td>

                                        {/* অথর নেম ও ইমেইল */}
                                        <td className="py-4 px-4 text-gray-600 font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-bold capitalize">{authorName}</span>
                                                <span className="text-xs text-gray-400 font-normal">{authorEmail}</span>
                                            </div>
                                        </td>

                                        {/* ক্যাটাগরি ব্যাজ */}
                                        <td className="py-4 px-4 text-center">
                                            <span className="bg-orange-50 text-orange-600 border border-orange-100/50 px-3 py-1.5 rounded-full text-xs font-bold">
                                                {recipe.category || "General"}
                                            </span>
                                        </td>

                                        {/* লাইকস কাউন্টার */}
                                        <td className="py-4 px-4 text-center text-orange-600 font-bold text-sm">
                                            ❤️ {totalLikes}
                                        </td>

                                        {/* ফিচারড নাকি রেগুলার স্ট্যাটাস */}
                                        <td className="py-4 px-4 text-center">
                                            {recipe.isFeatured ? (
                                                <span className="bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                    ⭐ Featured
                                                </span>
                                            ) : (
                                                <span className="bg-gray-50 text-gray-400 border border-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                                                    Regular
                                                </span>
                                            )}
                                        </td>

                                        {/* অ্যাকশন বাটনসমূহ */}
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => toggleFeatureStatus(recipeId, recipe.isFeatured)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                                        recipe.isFeatured
                                                            ? "bg-purple-50 text-purple-600 hover:bg-purple-100/70"
                                                            : "bg-amber-50 text-amber-600 hover:bg-amber-100/70"
                                                    }`}
                                                >
                                                    {recipe.isFeatured ? "Unfeature" : "✨ Feature"}
                                                </button>
                                                
                                                <button 
                                                    onClick={() => handleDeleteRecipe(recipeId)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100/70 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Managerecipes;