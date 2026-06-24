import AddRecipeMenu from "@/component/AddrecipeMenu/Addrecipe";
import React, { Suspense } from "react";

const AddRecipe = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 text-sm font-medium text-orange-600 bg-orange-100 rounded-full">
            Recipe Creator
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-bold text-gray-900">
            Add Your Recipe
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Share your favorite recipe with the community. Add ingredients,
            preparation steps, cooking time, and a beautiful image to inspire
            other food lovers.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white text-center rounded-3xl shadow-lg border border-gray-100 p-6 md:p-10">
          <Suspense fallback={<p>Loading....</p>}>
            <AddRecipeMenu />
          </Suspense>

        </div>
      </div>
    </div>
  );
};

export default AddRecipe;