// popularRecipe/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PopularRecipeDetails = () => {
  const params = useParams();
  const recipeId = params?.id || '';
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!recipeId) {
        setError('Recipe ID not found');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/popularRecipe/${recipeId}`);
        
        if (response.status === 404) {
          setError('Recipe not found');
          setIsLoading(false);
          return;
        }
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        
        const data = await response.json();
        setRecipe(data);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-8 space-y-4">
              <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
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
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Back to Popular Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get rank badge
  const getRankBadge = (rank) => {
    const colors = {
      1: 'bg-yellow-500 text-white',
      2: 'bg-gray-400 text-white',
      3: 'bg-amber-600 text-white',
    };
    return colors[rank] || 'bg-blue-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-[400px] w-full">
            <Image
              src={recipe.imageUrl}
              alt={recipe.recipeName}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {recipe.rank && (
              <div className={`absolute top-6 left-6 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${getRankBadge(recipe.rank)}`}>
                #{recipe.rank}
              </div>
            )}
            
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
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

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {recipe.category && (
                <div className={`px-4 py-2 rounded-full text-center ${getCategoryColor(recipe.category)}`}>
                  {recipe.category}
                </div>
              )}
              {recipe.cuisineType && (
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-center">
                  {recipe.cuisineType}
                </div>
              )}
              {recipe.prepTime && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-full text-center">
                  ⏱️ {recipe.prepTime}
                </div>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About This Recipe
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {recipe.description || `A delicious ${recipe.recipeName} recipe that's loved by our community.`}
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularRecipeDetails;