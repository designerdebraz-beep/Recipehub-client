'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Chip, Surface, Pagination } from "@heroui/react";
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'; 
import Search from '@/component/Search';

const HeartIcon = ({ className = "size-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const CATEGORIES = [
  "All", "Breakfast", "Lunch", "Dinner", "Main Course", "Dessert", 
  "Snacks", "Beverages", "Pasta", "Pizza", "Seafood", "Noodles", "Fast Food", "Salad"
];

const ITEMS_PER_PAGE = 6;

export default function BrowseAllProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlCategory = searchParams.get('category'); 
  const searchQuery = searchParams.get('search') || '';

  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  // Fetch data from API based on currentPage and searchQuery
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const BasedUrl = process.env.BasedUrl || process.env.NEXT_PUBLIC_BASED_URL || 'http://localhost:5000';
      
      // ✅ Add search query to API call if it exists
      let url = `${BasedUrl}/api/recipes?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
      
      // If there's a search query, add it to the API call
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
        setTotalItemsCount(data.totalItems || 0);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    if (urlCategory) {
      const matchedCategory = CATEGORIES.find(
        (c) => c.toLowerCase() === urlCategory.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategory(matchedCategory);
      }
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory]);

  // Client side filtering (for category only, since search is handled by API)
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = 
      selectedCategory === "All" || 
      recipe.category?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesCategory;
  });

  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // Handle search from the Search component
  const handleSearch = (term) => {
    // The Search component already handles the redirect with the search query
    console.log('Search term:', term);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          All Recipes
        </h1>
        <div className="mt-4">
          <Search 
            onSearch={handleSearch}
            redirectPath="/recipes"
            placeholder="Search recipes..."
            size="lg"
            fullWidth={true}
            className="max-w-2xl"
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-md text-primary font-medium">
            Showing results for search: "{searchQuery}"
          </p>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex flex-wrap gap-2.5 mb-12 items-center">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (category === "All") {
                  params.delete('category');
                } else {
                  params.set('category', category.toLowerCase());
                }
                router.push(`?${params.toString()}`);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 ${
                isActive 
                  ? 'bg-foreground text-background border-foreground shadow-sm' 
                  : 'bg-background text-muted-foreground border-border hover:bg-secondary-soft hover:text-foreground'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mb-6 text-sm text-muted-foreground">
        Showing {filteredRecipes.length > 0 ? startIndex + 1 : 0}–{startIndex + filteredRecipes.length} of {totalItemsCount} results
      </div>

      {/* Grid States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 w-full bg-secondary-soft animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <Surface variant="soft" className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground font-medium text-lg">No recipes found matching your criteria.</p>
          {searchQuery && (
            <button 
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                router.push(`?${params.toString()}`);
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear search
            </button>
          )}
        </Surface>
      ) : (
        <>
          {/* Main Grid Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => {
              const recipeId = recipe._id?.$oid || recipe._id;
              
              return (
                <Card 
                  key={recipeId} 
                  variant="flat" 
                  onClick={() => router.push(`/recipes/${recipeId}`)}
                  className="overflow-hidden group border border-border bg-surface hover:shadow-xl transition-all duration-300 rounded-2xl flex flex-col h-full cursor-pointer select-none"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary-soft">
                    <Image 
                      src={recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"} 
                      alt={recipe.recipeName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {recipe.category && (
                      <Chip size="sm" variant="solid" className="absolute top-4 left-4 font-semibold text-xs tracking-wide bg-background/90 text-foreground backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm">
                        {recipe.category}
                      </Chip>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-foreground tracking-tight line-clamp-1">
                      {recipe.recipeName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground font-medium">
                      <span>{recipe.cuisineType || 'International'}</span>
                      <span>•</span>
                      <span>{recipe.prepTime || '30 mins'}</span>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-xs px-2.5 py-1 bg-success-soft text-success font-semibold rounded-full capitalize">
                        {recipe.difficultyLevel || 'Easy'}
                      </span>
                    </div>
                    <div className="w-full h-[1px] bg-border my-5 mt-auto" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center border border-border uppercase shadow-inner">
                          {recipe.recipeName?.charAt(0) || 'R'}
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">Chef Collection</span>
                      </div>
                      {/* <div className="flex items-center gap-1.5 px-2 text-muted-foreground">
                        <HeartIcon className="size-4" />
                        <span className="text-xs font-bold">119</span>
                      </div> */}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 w-full">
              <Pagination className="justify-center" size="lg">
                <Pagination.Content>
                  
                  <Pagination.Item>
                    <Pagination.Previous 
                      isDisabled={currentPage === 1} 
                      onPress={() => {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Pagination.PreviousIcon />
                      <span>Previous</span>
                    </Pagination.Previous>
                  </Pagination.Item>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Pagination.Item key={p}>
                      <Pagination.Link 
                        isActive={p === currentPage} 
                        onPress={() => {
                          setCurrentPage(p);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {p}
                      </Pagination.Link>
                    </Pagination.Item>
                  ))}

                  <Pagination.Item>
                    <Pagination.Next 
                      isDisabled={currentPage === totalPages} 
                      onPress={() => {
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <span>Next</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>

                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </>
      )}
    </section>
  );
}