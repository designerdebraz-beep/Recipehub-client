"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const Managerecipes = () => {
    // ইমেজ (image_44bb01.jpg) অনুযায়ী ডামি রেসিপি ডাটা অ্যারে
    const [recipes, setRecipes] = useState([
        { id: 1, name: "Pasta", author: "Abc", category: "Breakfast", likes: 1, isFeatured: false, image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=150" },
        { id: 2, name: "Caesar Salad", author: "Ayesha Rahman", category: "Salad", likes: 72, isFeatured: false, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=150" },
        { id: 3, name: "Mexican Beef Tacos", author: "Mehedi Hasan", category: "Fast Food", likes: 119, isFeatured: false, image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=150" },
        { id: 4, name: "Chicken Shawarma Wrap", author: "Sadia Noor", category: "Fast Food", likes: 156, isFeatured: false, image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=150" },
        { id: 5, name: "Pad Thai", author: "Rafi Islam", category: "Noodles", likes: 127, isFeatured: false, image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=150" },
        { id: 6, name: "Sushi Roll", author: "Sabbir Hossain", category: "Seafood", likes: 175, isFeatured: false, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=150" },
        { id: 7, name: "Margherita Pizza", author: "Mim Akter", category: "Pizza", likes: 210, isFeatured: false, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=150" },
        { id: 8, name: "Pasta Alfredo", author: "Fahim Hasan", category: "Pasta", likes: 89, isFeatured: true, image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=150" },
    ]);

    // ফিচারড স্ট্যাটাস টগল হ্যান্ডলার
    const toggleFeatureStatus = (id) => {
        setRecipes(recipes.map(recipe => {
            if (recipe.id === id) {
                return { ...recipe, isFeatured: !recipe.isFeatured };
            }
            return recipe;
        }));
    };

    // রেসিপি ডিলিট হ্যান্ডলার
    const handleDeleteRecipe = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (confirmDelete) {
            setRecipes(recipes.filter(recipe => recipe.id !== id));
        }
    };

    return (
        <div className="p-8 w-full bg-[#F8F9FA] min-h-screen">
            {/* হেডার সেকশন */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 tracking-tight">
                    Manage Recipes <span className="text-2xl">📋</span>
                </h1>
                <p className="text-gray-400 text-sm mt-1">Delete recipes or toggle featured status</p>
            </div>

            {/* রেসিপি টেবিল কন্টেইনার */}
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
                        {recipes.map((recipe) => (
                            <tr key={recipe.id} className="hover:bg-gray-50/40 transition-colors">
                                
                                {/* রেসিপি ইমেজ ও নাম */}
                                <td className="py-4 px-6 flex items-center gap-4">
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                        <Image 
                                            src={recipe.image} 
                                            alt={recipe.name} 
                                            fill 
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <span className="font-bold text-gray-900">{recipe.name}</span>
                                </td>

                                {/* অথর নেম */}
                                <td className="py-4 px-4 text-gray-600 font-medium">
                                    {recipe.author}
                                </td>

                                {/* ক্যাটাগরি ব্যাজ */}
                                <td className="py-4 px-4 text-center">
                                    <span className="bg-orange-50 text-orange-600 border border-orange-100/50 px-3 py-1.5 rounded-full text-xs font-bold">
                                        {recipe.category}
                                    </span>
                                </td>

                                {/* লাইকস কাউন্টার */}
                                <td className="py-4 px-4 text-center text-orange-600 font-bold text-sm">
                                    ❤️ {recipe.likes}
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

                                {/* অ্যাকশন বাটনসমূহ (Feature/Unfeature + Delete) */}
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button 
                                            onClick={() => toggleFeatureStatus(recipe.id)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                                                recipe.isFeatured
                                                    ? "bg-purple-50 text-purple-600 hover:bg-purple-100/70"
                                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100/70"
                                            }`}
                                        >
                                            {recipe.isFeatured ? "Unfeature" : "✨ Feature"}
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDeleteRecipe(recipe.id)}
                                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100/70 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Managerecipes;