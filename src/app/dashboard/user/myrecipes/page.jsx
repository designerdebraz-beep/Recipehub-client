

"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Image from "next/image";

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const session = await authClient.getSession();

                const userId = session?.data?.user?.id;

                console.log("User ID:", userId);

                if (!userId) {
                    setLoading(false);
                    return;
                }

                const res = await fetch(
                    `http://localhost:5000/api/my-recipes/${userId}`
                );

                const data = await res.json();

                console.log(data);

                setRecipes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                Loading...
            </div>
        );
    }

    return (
        <div>
             <h4 className="text-3xl font-bold mb-4"> Total recipes  {recipes.length}</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {recipes.map((recipe) => (
                    <div
                        key={recipe._id}
                        className="bg-white rounded-xl shadow overflow-hidden"
                    >

                        <div className="relative h-52">
                            <Image
                                src={recipe.imageUrl}
                                alt={recipe.recipeName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-4">
                            <h2 className="font-bold text-xl">
                                {recipe.recipeName}
                            </h2>

                            <p className="text-gray-500">
                                {recipe.category}
                            </p>

                            <p className="text-sm mt-2">
                                Cuisine: {recipe.cuisineType}
                            </p>

                            <p className="text-sm">
                                Prep Time: {recipe.prepTime}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRecipes;