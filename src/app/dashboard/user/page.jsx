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

const UserDashboard = async () => {

  const session = await auth.api.getSession({
      headers: await headers()
    });
    
    const user = session?.user;
    
    // If no user, redirect to login
    if (!user) {
      redirect('/login');
    }

const res = await fetch(
    `http://localhost:5000/api/my-recipes/${user.id}`,
    {
      cache: "no-store"
    }
  );

  const recipes = await res.json();
  console.log(recipes)

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
        <div className="bg-white rounded-2xl shadow p-6">
          <BookOpen className="w-10 h-10 text-blue-600" />
          <h3 className="mt-4 text-3xl font-bold"> {recipes.length}</h3>
          <p className="text-gray-500">My Recipes</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <Heart className="w-10 h-10 text-red-500" />
          <h3 className="mt-4 text-3xl font-bold">0</h3>
          <p className="text-gray-500">Favorites</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <ChefHat className="w-10 h-10 text-green-600" />
          <h3 className="mt-4 text-3xl font-bold">0</h3>
          <p className="text-gray-500">Total Likes</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <User className="w-10 h-10 text-purple-600" />
          <h3 className="mt-4 text-3xl font-bold">1</h3>
          <p className="text-gray-500">Profile</p>
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

        <div className="grid gap-4 md:grid-cols-3">
          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
            <PlusCircle size={20} />
            Add New Recipe
          </button>

          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-600 text-white hover:bg-green-700">
            <BookOpen size={20} />
            View My Recipes
          </button>

          <button className="flex items-center justify-center gap-2 p-4 rounded-xl bg-purple-600 text-white hover:bg-purple-700">
            <Heart size={20} />
            Favorites
          </button>
        </div>
      </div> */}

      {/* Recent Recipes */}
      {/* <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Recipes</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Recipe</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Likes</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-3">Chicken Biryani</td>
                <td>Main Course</td>
                <td>120</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Published
                  </span>
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-3">Greek Salad</td>
                <td>Salad</td>
                <td>78</td>
                <td>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Published
                  </span>
                </td>
              </tr>

              <tr>
                <td className="py-3">French Fries</td>
                <td>Snacks</td>
                <td>45</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    Draft
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default UserDashboard;