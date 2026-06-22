"use client";

import React, { useState, useEffect } from 'react';
import { Button, Label, Modal, Surface, TextField, Input } from "@heroui/react";
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation'; 

const RecipeIcon = () => (
  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function AddRecipeMenu() {
  const router = useRouter();
  const searchParams = useSearchParams(); 

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
  const [recipeCount, setRecipeCount] = useState(0);
  const [userPlan, setUserPlan] = useState('free'); 
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const BasedUrl = process.env.BasedUrl || process.env.NEXT_PUBLIC_BASED_URL || 'http://localhost:5000';

  // ১. ইউজারের সেশন থেকে ইমেইল আলাদাভাবে ট্র্যাক করার জন্য Effect
  useEffect(() => {
    const getUserSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user?.email) {
          setCurrentUserEmail(sessionData.user.email);
        }
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    };
    getUserSession();
  }, []);

// ২. পেমেন্ট কনফার্মেশন হ্যান্ডেল করার জন্য ফিক্সড Effect (টোকেন হেডার সহ)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentStatus = searchParams.get('payment');
      
      if (paymentStatus === 'success' && currentUserEmail) {
        try {
          const generatedTxId = `ST_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const paymentPayload = {
            email: currentUserEmail,
            amount: 4.99,
            packageName: "Premium Pass (PRO)",
            transactionId: generatedTxId
          };

          // 👑 টোকেন নিয়ে আসা হলো যাতে ব্যাকএন্ডের verifyToken মিডলওয়্যার রিজেক্ট না করে 👑
          const { data: tokenData } = await authClient.token();
          if (!tokenData?.token) {
            console.error("Authorization token missing, cannot confirm payment.");
            return;
          }

          const response = await fetch(`${BasedUrl}/api/payments/confirm`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'authorization': `bearer ${tokenData.token}` // 👑 এই হেডারটি অতি জরুরি ছিল
            },
            body: JSON.stringify(paymentPayload)
          });

          if (response.ok) {
            setUserPlan('pro'); 
            setTransactionDetails(paymentPayload);
            setShowSuccessPage(true);
          } else {
            const errData = await response.json().catch(() => ({}));
            console.error("Payment registration failed at backend:", errData.error);
          }
        } catch (error) {
          console.error("Error saving payment transaction:", error);
        }
      }
    };

    checkPaymentStatus();
  }, [searchParams, BasedUrl, currentUserEmail]); // currentUserEmail আপডেট হলেই কেবল রান হবে

  // ৩. ইউজারের বর্তমান পোস্ট সংখ্যা এবং ডাটাবেজের প্ল্যান জানার জন্য Effect
  useEffect(() => {
    const fetchUserRecipeCount = async () => {
      try {
        const { data: token } = await authClient.token();
        if (!token?.token) return;

        const response = await fetch(`${BasedUrl}/api/my-recipes/count`, {
          headers: { authorization: `bearer ${token.token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRecipeCount(data.count || 0);
          if (data.plan) {
            setUserPlan(data.plan); 
          }
        }
      } catch (error) {
        console.error("Error fetching recipe count:", error);
      }
    };

    fetchUserRecipeCount();
  }, [BasedUrl, showSuccessPage]);

  const handleCloseSuccessPage = () => {
    setShowSuccessPage(false);
    router.replace('/dashboard/user/addrecipe'); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePaymentRedirect = () => {
    router.push('/payment');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (recipeCount >= 3 && userPlan !== 'pro') {
      router.push('/payment');
      return;
    }

    if (!imageFile) {
      alert("Please select a recipe image.");
      return;
    }

    setIsSubmitting(true);
    let imageUrl = '';
    
    try {
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

      const { data: token } = await authClient.token();

      const response = await fetch(`${BasedUrl}/api/recipes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          authorization: `bearer ${token.token}`
        },
        body: JSON.stringify(recipePayload),
      });

      if (response.ok) {
        alert('Recipe successfully added to your collection!');
        setFormData(initialFormState);
        setImageFile(null);
        setRecipeCount(prev => prev + 1); 
        e.target.reset(); 
      } else {
        const errorData = await response.json().catch(() => ({}));
        if(response.status === 403) {
          router.push('/payment');
        } else {
          alert(`Failed to save data: ${errorData.error || 'Server processing error.'}`);
        }
      }

    } catch (error) {
      console.error("Submission Error Pipeline:", error);
    } finally { // 👑 এখানে 'file:' টাইপো ফিক্স করে 'finally' করা হয়েছে
      setIsSubmitting(false);
    }
  };

  const isLocked = recipeCount >= 3 && userPlan !== 'pro';

  if (showSuccessPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/90 backdrop-blur-md p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 text-green-600 mb-6">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 text-sm mb-6">
            Thank you! Your account has been upgraded to <span className="font-bold text-pink-700">PRO Plan</span>. Enjoy unlimited recipe posting.
          </p>
          {transactionDetails && (
            <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 space-y-3 mb-6 text-sm">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Package</span>
                <span className="text-gray-900 font-bold">{transactionDetails.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Amount Paid</span>
                <span className="text-green-600 font-bold">${transactionDetails.amount} USD</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 font-medium">Transaction ID</span>
                <span className="text-mono font-bold text-gray-700 text-xs bg-gray-200/60 px-2 py-0.5 rounded-md">
                  {transactionDetails.transactionId}
                </span>
              </div>
            </div>
          )}
          <button onClick={handleCloseSuccessPage} className="w-full bg-pink-700 text-white font-semibold py-3.5 rounded-xl hover:bg-pink-800 shadow-md shadow-pink-700/20 transition-all active:scale-[0.98]">
            Start Posting Recipes 🍳
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
                <div className="mt-1.5 text-sm leading-5 text-muted">
                  Fill in the details below to add a new recipe to your collection. 
                  <span className="block font-semibold text-orange-600 mt-1">
                    {userPlan === 'pro' ? "👑 PRO Plan Active (Unlimited Posts)" : `(Remaining free posts: ${Math.max(0, 3 - recipeCount)})`}
                  </span>
                </div>
              </Modal.Header>
              
              <Modal.Body className="p-6">
                <Surface variant="default">
                  <form id="recipeForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <TextField className="w-full" variant="secondary">
                      <Label>Recipe Name</Label>
                      <Input name="recipeName" value={formData.recipeName} onChange={handleInputChange} placeholder="e.g., Chocolate Fudge Cake" required={!isLocked} />
                    </TextField>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-sm font-medium text-foreground">Recipe Image</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} required={!isLocked} className="w-full px-3 py-2 text-sm bg-secondary-soft hover:bg-secondary-soft-hover rounded-lg border border-border focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground cursor-pointer" />
                    </div>
                    <TextField className="w-full" variant="secondary">
                      <Label>Category</Label>
                      <Input name="category" value={formData.category} onChange={handleInputChange} placeholder="e.g., Dessert" required={!isLocked} />
                    </TextField>
                    <TextField className="w-full" variant="secondary">
                      <Label>Cuisine Type</Label>
                      <Input name="cuisineType" value={formData.cuisineType} onChange={handleInputChange} placeholder="e.g., Italian" required={!isLocked} />
                    </TextField>
                    <TextField className="w-full" variant="secondary">
                      <Label>Difficulty Level</Label>
                      <Input name="difficultyLevel" value={formData.difficultyLevel} onChange={handleInputChange} placeholder="e.g., Easy" required={!isLocked} />
                    </TextField>
                    <TextField className="w-full" variant="secondary">
                      <Label>Preparation Time</Label>
                      <Input name="prepTime" value={formData.prepTime} onChange={handleInputChange} placeholder="e.g., 30 mins" required={!isLocked} />
                    </TextField>
                    <TextField className="w-full" variant="secondary">
                      <Label>Ingredients</Label>
                      <Input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="Flour, Sugar" required={!isLocked} />
                    </TextField>
                    <TextField className="w-full" variant="secondary">
                      <Label>Instructions</Label>
                      <Input name="instructions" value={formData.instructions} onChange={handleInputChange} placeholder="Mix and bake..." required={!isLocked} />
                    </TextField>
                  </form>
                </Surface>
              </Modal.Body>

              <Modal.Footer>
                <Button slot="close" variant="secondary" disabled={isSubmitting}>
                  Cancel
                </Button>
                {isLocked ? (
                  <Button className='text-xl bg-pink-700 text-white' type="button" onClick={handlePaymentRedirect}>
                    Unlock with Payment
                  </Button>
                ) : (
                  <Button className='text-xl bg-pink-700 text-white' type="submit" form="recipeForm" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Recipe'}
                  </Button>
                )}
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}