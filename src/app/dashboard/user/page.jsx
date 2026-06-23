import React from "react";
import {
  BookOpen,
  Heart,
  PlusCircle,
  User,
  ChefHat,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation"; 

const UserDashboard = async () => {

  const session = await auth.api.getSession({
    headers: await headers()
  });
    
  const user = session?.user;
    
  // If no user, redirect to login
  if (!user) {
    redirect('/login');
  }

  // ১. ইউজারের নিজস্ব রেসিপি ডাটা আনা হচ্ছে
  const recipesRes = await fetch(
    `http://localhost:5000/api/my-recipes/${user.id}`,
    { cache: "no-store" }
  );
  const recipes = await recipesRes.json();

  // ২. ইউজারের ফেভারিট রেসিপি ডাটা আনা হচ্ছে
  let favorites = [];
  try {
    const favoritesRes = await fetch(
      `http://localhost:5000/api/favorites/${user.id}`,
      { cache: "no-store" }
    );
    if (favoritesRes.ok) {
      favorites = await favoritesRes.json();
    }
  } catch (error) {
    console.error("Dashboard favorites fetch error:", error);
  }

  // ৩. ইউজারের টোটাল লাইক করা রেসিপি ডাটা আনা হচ্ছে (নতুন যুক্ত করা হয়েছে)
  let likes = [];
  try {
    const likesRes = await fetch(
      `http://localhost:5000/api/likes/${user.id}`,
      { cache: "no-store" }
    );
    if (likesRes.ok) {
      likes = await likesRes.json();
    }
  } catch (error) {
    console.error("Dashboard likes fetch error:", error);
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
        <h1 className="text-3xl font-bold">Welcome Back 👋</h1>
        <p className="mt-2 text-blue-100">
          Manage your recipes, track your activity, and discover new ideas.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* My Recipes Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <h3 className="mt-4 text-3xl font-bold"> {Array.isArray(recipes) ? recipes.length : 0}</h3>
          <p className="text-gray-500">My Recipes</p>
        </div>

        {/* Favorites Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <Heart className="w-10 h-10 text-red-500" />
          <h3 className="mt-4 text-3xl font-bold">{Array.isArray(favorites) ? favorites.length : 0}</h3>
          <p className="text-gray-500">Favorites</p>
        </div>

        {/* Total Likes Card - ✅ ডায়নামিক লাইক কাউন্ট বসানো হয়েছে */}
        <div className="bg-white rounded-2xl shadow p-6">
          <ChefHat className="w-10 h-10 text-green-600" />
          <h3 className="mt-4 text-3xl font-bold">{Array.isArray(likes) ? likes.length : 0}</h3>
          <p className="text-gray-500">Total Likes</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow p-6">
          <User className="w-10 h-10 text-purple-600" />
          <h3 className="mt-4 text-3xl font-bold">1</h3>
          <p className="text-gray-500">Profile</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;