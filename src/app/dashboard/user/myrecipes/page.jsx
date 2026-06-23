"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const MyRecipes = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // এডিট মডালের জন্য স্টেট সমূহ
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [formData, setFormData] = useState({
        recipeName: "",
        imageUrl: "",
        category: "",
        cuisineType: "",
        difficultyLevel: "", // 👈 ডাটাবেজ অনুযায়ী difficultyLevel করা হলো
        prepTime: "",
        ingredients: "",
        instructions: ""
    });

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const session = await authClient.getSession();
                const userId = session?.data?.user?.id;

                if (!userId) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(`http://localhost:5000/api/my-recipes/${userId}`);
                const data = await res.json();
                setRecipes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // ভিউ হ্যান্ডলার লজিক
    const handleView = (id) => {
        router.push(`/recipes/${id}`);
    };

    // এডিট বাটনে ক্লিক লজিক
    const handleEditClick = (recipe) => {
        setSelectedRecipeId(recipe._id);
        setFormData({
            recipeName: recipe.recipeName || "",
            imageUrl: recipe.imageUrl || "",
            category: recipe.category || "",
            cuisineType: recipe.cuisineType || "",
            difficultyLevel: recipe.difficultyLevel || "Easy", // 👈 ডাটাবেজ প্রোপার্টি ম্যাপিং
            prepTime: recipe.prepTime || "",
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : recipe.ingredients || "",
            instructions: recipe.instructions || ""
        });
        setIsEditModalOpen(true);
    };

    // ফর্ম সাবমিট (PATCH) লজিক
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        try {
            // ingredients যদি স্ট্রিং হয়, তবে সেটিকে কমা অনুযায়ী অ্যারেতে কনভার্ট করা ভালো
            const processedIngredients = typeof formData.ingredients === 'string' 
                ? formData.ingredients.split(',').map(item => item.trim()) 
                : formData.ingredients;

            const updatedData = {
                ...formData,
                ingredients: processedIngredients
            };

            const res = await fetch(`http://localhost:5000/api/my-recipes/${selectedRecipeId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (res.ok) {
                setRecipes(recipes.map(recipe => 
                    recipe._id === selectedRecipeId ? { ...recipe, ...updatedData } : recipe
                ));
                setIsEditModalOpen(false);
                alert("Recipe updated successfully!");
            } else {
                alert("Failed to update recipe");
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    };

    // ডিলিট হ্যান্ডলার লজিক
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/my-recipes/${id}`, {
                method: "DELETE",
                });

            if (res.ok) {
                setRecipes(recipes.filter((recipe) => recipe._id !== id));
                alert("Recipe deleted successfully!");
            } else {
                alert("Failed to delete recipe");
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center py-20 text-gray-500 font-medium">Loading...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto relative">
            {/* হেডার সেকশন */}
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                    My Recipes <span className="text-2xl">📋</span>
                </h1>
               <Link href='/dashboard/user/addrecipe'>
                 <button className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    + Add Recipe
                </button>
               </Link>
            </div>
            <p className="text-gray-500 text-sm mb-6">{recipes.length} recipe published</p>

            {/* টেবিল */}
            <div className="w-full overflow-x-auto border border-gray-100 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                            <th className="py-4 px-6 font-medium">Recipe</th>
                            <th className="py-4 px-4 font-medium">Category</th>
                            <th className="py-4 px-4 font-medium">Difficulty</th>
                            <th className="py-4 px-4 font-medium">Likes</th>
                            <th className="py-4 px-6 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-700">
                        {recipes.map((recipe) => (
                            <tr key={recipe._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 flex items-center gap-4">
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image src={recipe.imageUrl || "/placeholder.jpg"} alt={recipe.recipeName} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{recipe.recipeName}</h3>
                                        <span className="text-xs text-gray-400 font-normal">16/06/2026</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold">{recipe.category || "Breakfast"}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold">{recipe.difficultyLevel || "Easy"}</span>
                                </td>
                                
                                {/* 🎯 ডায়নামিক লাইক কাউণ্টার নিচে ফিক্স করা হলো */}
                                <td className="py-4 px-4">
                                    ❤️ <span className="text-xs font-bold">{recipe.likesCount ?? 0}</span>
                                </td>

                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleView(recipe._id)} className="px-4 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 cursor-pointer">View</button>
                                        <button onClick={() => handleEditClick(recipe)} className="px-4 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(recipe._id)} className="px-4 py-1.5 bg-red-50 text-red-500 text-xs font-bold rounded-lg cursor-pointer">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ================= EDIT MODAL POPUP ================= */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Update Recipe Details</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Recipe Name</label>
                                    <input type="text" value={formData.recipeName} onChange={(e) => setFormData({...formData, recipeName: e.target.value})} className="w-full border p-2 rounded-lg text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Recipe Image URL</label>
                                    <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                                    <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cuisine Type</label>
                                    <input type="text" value={formData.cuisineType} onChange={(e) => setFormData({...formData, cuisineType: e.target.value})} className="w-full border p-2 rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Difficulty Level</label>
                                    <select value={formData.difficultyLevel} onChange={(e) => setFormData({...formData, difficultyLevel: e.target.value})} className="w-full border p-2 rounded-lg text-sm">
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Preparation Time</label>
                                    <input type="text" value={formData.prepTime} onChange={(e) => setFormData({...formData, prepTime: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="e.g., 30 mins" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ingredients</label>
                                <textarea rows="3" value={formData.ingredients} onChange={(e) => setFormData({...formData, ingredients: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="List ingredients separated by commas..."></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Instructions</label>
                                <textarea rows="4" value={formData.instructions} onChange={(e) => setFormData({...formData, instructions: e.target.value})} className="w-full border p-2 rounded-lg text-sm" placeholder="Step by step instructions..."></textarea>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-sm font-semibold">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyRecipes;