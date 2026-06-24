// app/recipes/[id]/page.jsx
import React from 'react';
import RecipeDetailClientBlock from '@/component/AddrecipeMenu/RecipeDetailClientBlock';
import Link from 'next/link';

const RecipeDetailsPage = async ({ params }) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log('Recipe ID:', id);
  
  let recipeData = null;
  let error = null;

  try {
    const BasedUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
    
    // ✅ FIX: Fetch the specific recipe by ID directly
    const res = await fetch(`${BasedUrl}/api/recipes/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    // Handle 404 specifically
    if (res.status === 404) {
      console.log('Recipe not found with ID:', id);
      recipeData = null;
    } else if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    } else {
      const data = await res.json();
      recipeData = data;
      console.log('Recipe found:', recipeData);
    }
    
  } catch (err) {
    error = err.message;
    console.error("Failed to fetch recipe details:", err);
  }

  // If no match is found or there was an error, show appropriate message
  if (!recipeData) {
    return (
      <div className="max-w-xl mx-auto text-center py-24 px-4 h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-extrabold text-foreground">
          {error ? 'Error Loading Recipe' : 'Recipe Not Found'}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm max-w-sm">
          {error 
            ? `Unable to load recipe data: ${error}`
            : `Could not find a recipe with ID: ${id}`
          }
        </p>
        <Link 
          href="/" 
          className="mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-bold bg-foreground text-background rounded-xl shadow-sm hover:bg-foreground/90 transition-colors"
        >
          Return to Directory
        </Link>
      </div>
    );
  }

  // If a match is found, send the data to your layout block
  return <RecipeDetailClientBlock initialRecipe={recipeData} />;
};

export default RecipeDetailsPage;