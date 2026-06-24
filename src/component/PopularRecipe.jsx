'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PopularRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      try {
        // ব্যাকএন্ড এপিআই কল
        const response = await fetch('http://localhost:5000/api/popular-recipes?limit=8');
        
        if (!response.ok) {
          throw new Error('Failed to fetch popular recipes');
        }
        
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching popular recipes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularRecipes();
  }, []);

  
  const getRankStyle = (index) => {
    if (index === 0) return 'bg-black text-white dark:bg-gray-700'; // Rank 1
    if (index === 1) return 'bg-black text-white dark:bg-gray-700'; // Rank 2
    if (index === 2) return 'bg-black text-white dark:bg-gray-700'; // Rank 3
    return 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'; // Others
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div>
          <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white my-4 mt-2">
                        Popular Recipes
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our Popular Liked selection of delicious recipes from around the world
                    </p>
                </div>
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
       
        
        {/* গ্রিড লেআউট (ইমেজের মতো ৩টি কলামে দেখানোর জন্য) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {recipes.map((recipe, index) => {
            const recipeId = recipe._id?.$oid || recipe._id;
            const rank = index + 1;

            return (
              <div
                key={recipeId}
                className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl transition-all duration-200 hover:shadow-md ${
                  rank === 3 ? 'bg-gray-50/50 border-gray-200' : ''
                }`}
              >
                {/* বাম পাশের অংশ: র্যাঙ্ক, ইমেজ এবং মেটা ইনফো */}
                <div className="flex items-center gap-4">
                  
                  {/* র্যাঙ্ক নাম্বার */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${getRankStyle(index)}`}>
                    {rank}
                  </div>

                  {/* রেসিপি ইমেজ */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=200"}
                      alt={recipe.recipeName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  {/* নাম এবং শেফ/ক্যাটাগরি */}
                  <div>
                    <Link href={`/recipes/${recipeId}`} className="hover:underline">
                      <h3 className="font-bold text-gray-900 dark:text-white text-[15px] line-clamp-1">
                        {recipe.recipeName}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {recipe.chefName || 'Chef'} • {recipe.category || 'Food'}
                    </p>
                  </div>
                </div>

                {/* ডান পাশের অংশ: লাইক কাউন্ট ও রিপোর্ট (ঐচ্ছিক) */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-100 dark:border-gray-700 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <svg 
                      className="w-3.5 h-3.5 text-gray-400" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{recipe.likesCount || 0}</span>
                  </div>

                  {/* প্রথম ইমেজের মতো রিপোর্ট মডাল ট্রিগার বাটন (প্রয়োজন হলে রাখতে পারেন) */}
                  <button 
                    onClick={() => console.log("Open Report Modal for:", recipe.recipeName)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                    title="Report Recipe"
                  >
                    <span className="text-sm">🚨</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
    </div>

  );
};

export default PopularRecipe;