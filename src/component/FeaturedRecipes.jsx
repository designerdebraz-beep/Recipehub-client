'use client';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedRecipes = () => {



    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

   useEffect(() => {
    const fetchFeaturedRecipes = async () => {
        try {
            // আপনার মেইন এপিআই রুট (যা দিয়ে সব রেসিপি আসে)
            const response = await fetch('http://localhost:5000/api/recipes');

            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }

            const data = await response.json();
            
            // 📝 ফ্রন্টএন্ডেই ফিল্টার করে শুধু true হওয়া রেসিপিগুলো রাখা হচ্ছে
            const featuredOnly = data.filter(recipe => recipe.isFeatured === true);
            
            setRecipes(featuredOnly);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching featured recipes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    fetchFeaturedRecipes();
}, []);

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'Salad': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'Snacks': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'Main Course': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'Breakfast': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
            'Dinner': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
            'Lunch': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
            'Dessert': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
            'Beverages': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    };



const floatingAnimation = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    };

    // Get cuisine emoji
    const getCuisineEmoji = (cuisine) => {
        const emojis = {
            'Greek': '🇬🇷',
            'Italian': '🇮🇹',
            'Indian': '🇮🇳',
            'American': '🇺🇸',
            'Japanese': '🇯🇵',
            'Mexican': '🇲🇽',
            'Chinese': '🇨🇳',
            'Thai': '🇹🇭',
            'French': '🇫🇷',
            'Spanish': '🇪🇸',
            'Belgian': '🇧🇪',
            'Turkish': '🇹🇷',
        };
        return emojis[cuisine] || '🌍';
    };

    if (isLoading) {
        return (
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto mb-4 animate-pulse"></div>
                        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                                <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-8">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Unable to Load Recipes</h3>
                        <p className="text-red-600 dark:text-red-300">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (recipes.length === 0) {
        return (
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Featured Recipes</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for delicious recipes!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Recipes
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-4"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our handpicked selection of delicious recipes from around the world
                    </p>
                </div>

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recipes.map((recipe) => {
                        const recipeId = recipe._id?.$oid || recipe._id;
                        return (
                            <div
                                key={recipeId}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"}
                                        alt={recipe.recipeName}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Category Badge */}
                                    {recipe.category && (
                                        <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(recipe.category)}`}>
                                            {recipe.category}
                                        </span>
                                    )}

                                    {/* Cuisine Badge */}
                                    {recipe.cuisineType && (
                                        <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full bg-black/50 backdrop-blur-sm text-white">
                                            {getCuisineEmoji(recipe.cuisineType)} {recipe.cuisineType}
                                        </span>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Recipe Name */}
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">
                                        {recipe.recipeName}
                                    </h3>

                                    {/* Meta Information */}
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        {recipe.prepTime && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {recipe.prepTime}
                                            </span>
                                        )}
                                        {recipe.cuisineType && (
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
                                                </svg>
                                                {recipe.cuisineType}
                                            </span>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 mb-4"></div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/recipes/${recipeId}`}
                                            className="flex-1 px-4 py-2 bg-[#d52626] hover:bg-[#c24242] text-white text-sm font-medium rounded-lg transition-colors duration-200 text-center"
                                        >
                                            View Recipe
                                        </Link>
                                        <button
                                            onClick={() => {
                                                console.log('Added to favorites:', recipe.recipeName);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                            aria-label="Add to favorites"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Button */}
                

                <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    className="select-none"
                >
                   <div className="text-center mt-12">
                    <Link
                        href="/recipes"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#d52626] dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200"
                    >
                        View All Recipes
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedRecipes;