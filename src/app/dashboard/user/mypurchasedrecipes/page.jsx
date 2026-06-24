"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import Image from 'next/image';
import Link from 'next/link';

// মূল কন্টেন্ট কম্পোনেন্ট
const PurchasedRecipesContent = () => {
  const searchParams = useSearchParams();
  const [purchasedRecipes, setPurchasedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get('session_id');
  const recipeId = searchParams.get('recipeId');
  const email = searchParams.get('email');

  useEffect(() => {
    const handleConfirmAndFetch = async () => {
  try {
    const session = await authClient.getSession();
    const rawEmail = session?.data?.user?.email || email;
    const userEmail = rawEmail ? rawEmail.toLowerCase().trim() : null;

    if (!userEmail) {
      setLoading(false);
      return;
    }

    // ১. পেমেন্ট কনফার্ম করা
    if (sessionId && recipeId) {
      const confirmRes = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/purchased-recipes/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, recipeId, email: userEmail })
      });
      
      if (confirmRes.ok) {
        // ডাটাবেজে রাইট হওয়ার জন্য ৩০০ মিলিমেকেন্ড ওয়েট করা (সেফটি মেজার)
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // ২. ইউজারের কেনা সব রেসিপির লিস্ট ফেচ করা
    const res = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/api/purchased-recipes/${userEmail}`);
    if (res.ok) {
      const data = await res.json();
      setPurchasedRecipes(data);
    }
  } catch (error) {
    console.error("Error loading purchased recipes:", error);
  } finally {
    setLoading(false);
  }
};

    handleConfirmAndFetch();
  }, [sessionId, recipeId, email]);

  if (loading) {
    return <div className="text-center py-20 font-bold text-xl">Loading your premium recipe collection...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-foreground mb-2">My Purchased Premium Recipes</h1>
      <p className="text-muted-foreground mb-8">Exclusive lifetime blueprint access to your unlocked culinary guides.</p>

      {purchasedRecipes.length === 0 ? (
        <div className="text-center py-16 bg-secondary-soft/30 rounded-2xl border border-dashed">
          <p className="text-muted-foreground font-medium">You haven't purchased any premium recipe cards yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* 🎯 ফিক্স: map মেথডের প্যারামিটারে (recipe, index) যুক্ত করা হয়েছে */}
          {purchasedRecipes.map((recipe, index) => (
            <div key={`${recipe._id}-${index}`} className="group bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image 
                  src={recipe.imageUrl || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800"} 
                  alt={recipe.recipeName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold text-success uppercase tracking-wider">{recipe.cuisineType || "Premium"}</span>
                <h3 className="text-lg font-bold text-foreground mt-1 line-clamp-1">{recipe.recipeName}</h3>
                <p className="text-xs text-muted-foreground mt-1">{recipe.category}</p>
                
                <Link href={`/recipes/${recipe._id}`}>
                  <button className="w-full mt-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-bold transition-opacity hover:opacity-90">
                    View Premium Recipe
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 👑 বিল্ড এরর এড়াতে এবং useSearchParams-কে সেফ রাখতে Suspense দিয়ে র‍্যাপ করে এক্সপোর্ট করা হলো
export default function Mypurchasedrecipes() {
  return (
    <Suspense fallback={
      <div className="text-center py-20 font-bold text-xl">Loading premium system setup...</div>
    }>
      <PurchasedRecipesContent />
    </Suspense>
  );
}