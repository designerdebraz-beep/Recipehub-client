"use client";

import React, { useState } from 'react';
import { Button, Label, Modal, Surface, TextField, Input } from "@heroui/react";

import { authClient } from '@/lib/auth-client';

const RecipeIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function AddRecipeMenu() {
  const initialFormState = {
    recipeName: '',
    category: '',
    cuisineType: '',
    difficultyLevel: '',
    prepTime: '',
    ingredients: '',
    instructions: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      alert("Please select a recipe image.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = '';
    
    try {
      // 1. Upload Image to imgbb
      const imgbbApiKey = "24b97a2efa4abcd4ba0946305ee81cff";
      const imageBody = new FormData();
      imageBody.append('image', imageFile);

      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: 'POST',
        body: imageBody,
      });

      const imgbbData = await imgbbResponse.json();
      
      if (imgbbData && imgbbData.success) {
        imageUrl = imgbbData.data.url;
      } else {
        throw new Error(imgbbData.error?.message || 'Imgbb upload rejected.');
      }

      // 2. Prepare payload
      const recipePayload = {
        recipeName: formData.recipeName,
        category: formData.category,
        cuisineType: formData.cuisineType,
        difficultyLevel: formData.difficultyLevel,
        prepTime: formData.prepTime,
        ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(Boolean), 
        instructions: formData.instructions,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString()
      };

      console.log("Submitting Recipe Payload: ", recipePayload);

    const {data:token} = await authClient.token() 

console.log(token.token)
      // 3. Store in recipes collection 
      // Safe fallback configuration checking if environment variable evaluates to undefined
      const BasedUrl = process.env.BasedUrl || process.env.NEXT_PUBLIC_BASED_URL || 'http://localhost:5000';
      
      const response = await fetch(`${BasedUrl}/api/recipes`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            authorization : `bearer ${token.token}`
            
    },

        body: JSON.stringify(recipePayload),
      });

      if (response.ok) {
        alert('Recipe successfully added to your collection!');
        setFormData(initialFormState);
        setImageFile(null);
        e.target.reset(); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save data: ${errorData.error || 'Server processing error.'}`);
      }

    } catch (error) {
      console.error("Submission Error Pipeline:", error);
      alert(`Error: ${error.message || 'An error occurred while saving the recipe.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal>
      <Button className='text-3xl bg-pink-700 text-white py-6 px-6'>Add New Recipe</Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <RecipeIcon />
              </Modal.Icon>
              <Modal.Heading>Add Recipe</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Fill in the details below to add a new recipe to your collection.
              </p>
            </Modal.Header>
            
            <Modal.Body className="p-6">
              <Surface variant="default">
                <form id="recipeForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
                  
                  {/* Recipe Name */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Recipe Name</Label>
                    <Input 
                      name="recipeName"
                      value={formData.recipeName}
                      onChange={handleInputChange}
                      placeholder="e.g., Chocolate Fudge Cake" 
                      required
                    />
                  </TextField>

                  {/* Recipe Image Upload */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-foreground">Recipe Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="w-full px-3 py-2 text-sm bg-secondary-soft hover:bg-secondary-soft-hover rounded-lg border border-border focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground cursor-pointer"
                    />
                  </div>

                  {/* Category */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Category</Label>
                    <Input 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Dessert, Main Course" 
                      required
                    />
                  </TextField>

                  {/* Cuisine Type */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Cuisine Type</Label>
                    <Input 
                      name="cuisineType"
                      value={formData.cuisineType}
                      onChange={handleInputChange}
                      placeholder="e.g., Italian, Mexican" 
                      required
                    />
                  </TextField>

                  {/* Difficulty Level */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Difficulty Level</Label>
                    <Input 
                      name="difficultyLevel"
                      value={formData.difficultyLevel}
                      onChange={handleInputChange}
                      placeholder="e.g., Easy, Medium, Hard" 
                      required
                    />
                  </TextField>

                  {/* Preparation Time */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Preparation Time</Label>
                    <Input 
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 30 mins, 1 hour" 
                      required
                    />
                  </TextField>

                  {/* Ingredients */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Ingredients (comma separated)</Label>
                    <Input 
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      placeholder="Flour, Sugar, Eggs, Chocolate" 
                      required
                    />
                  </TextField>

                  {/* Instructions */}
                  <TextField className="w-full" variant="secondary">
                    <Label>Instructions</Label>
                    <Input 
                      name="instructions"
                      value={formData.instructions}
                      onChange={handleInputChange}
                      placeholder="Mix ingredients, bake at 350°F for 30 minutes..." 
                      required
                    />
                  </TextField>

                </form>
              </Surface>
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button className='text-xl bg-pink-700 text-white' type="submit" form="recipeForm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Recipe'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}