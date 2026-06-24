'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

const FeaturedRecipesdelites = () => {
  const router = useRouter();
  const params = useParams(); // ✅ Use useParams hook instead of props
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get the ID from params
  const recipeId = params?.id || '';

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) {
        setError('Recipe ID not found');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch all featured recipes and find the one with matching ID
        const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/FeaturedRecipes`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        
        const data = await response.json();
        
        // Find the recipe with matching ID
        const foundRecipe = data.find(r => {
          const id = r._id?.$oid || r._id;
          return String(id) === String(recipeId);
        });

        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching recipe details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

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

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-8 space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-8">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              {error === 'Recipe not found' ? 'Recipe Not Found' : 'Unable to Load Recipe'}
            </h3>
            <p className="text-red-600 dark:text-red-300">
              {error || 'The recipe you\'re looking for doesn\'t exist.'}
            </p>
            <Link
              href="/FeaturedRecipes"
              className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/FeaturedRecipes"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Featured Recipes
        </Link>

        {/* Main Recipe Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image Section */}
          <div className="relative h-[400px] md:h-[500px] w-full">
            <Image
              src={recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"}
              alt={recipe.recipeName}
              fill
              className="object-cover"
              priority
            />
            {/* Dark Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Badges Overlay */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-3">
              {recipe.category && (
                <span className={`px-4 py-2 text-sm font-semibold rounded-full shadow-lg ${getCategoryColor(recipe.category)}`}>
                  {recipe.category}
                </span>
              )}
              {recipe.cuisineType && (
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-black/50 backdrop-blur-sm text-white shadow-lg">
                  {getCuisineEmoji(recipe.cuisineType)} {recipe.cuisineType}
                </span>
              )}
            </div>

            {/* Recipe Name Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                {recipe.recipeName}
              </h1>
              {recipe.prepTime && (
                <div className="flex items-center gap-2 text-white/90">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Preparation Time: {recipe.prepTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Recipe ID: {recipe._id?.$oid || recipe._id}
              </div>
            </div>

            {/* Recipe Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">👨‍🍳</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Cuisine</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.cuisineType || 'International'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.prepTime || '30 mins'}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">📂</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                <div className="font-semibold text-gray-900 dark:text-white">{recipe.category || 'General'}</div>
              </div>
            </div>

            {/* Recipe Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                About This Recipe
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {recipe.description || `A delicious ${recipe.recipeName} recipe from ${recipe.cuisineType || 'around the world'} cuisine. Perfect for ${recipe.category || 'any occasion'}!`}
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Ingredients
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Fresh vegetables
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Olive oil
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Herbs and spices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {recipe.cuisineType || 'Special'} ingredients
                  </li>
                </ul>
              </div>
            </div>

            {/* Instructions Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Instructions
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Prepare all ingredients and equipment.
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Follow the recipe steps carefully.
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">
                    Enjoy your delicious {recipe.recipeName}!
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

            {/* Related Recipes / Navigation */}
            <div className="flex flex-wrap justify-between items-center gap-4">
              <Link
                href="/FeaturedRecipes"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse More Recipes
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Back to Top
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedRecipesdelites;