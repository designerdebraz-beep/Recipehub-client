"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const BasedUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

  const handleProcessPayment = async () => {
    setLoading(true);
    
    try {
      // ১. ব্যাকএন্ডে সেশন তৈরির জন্য রিকোয়েস্ট পাঠানো
      const response = await fetch(`${BasedUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: 4.99,
          packageName: "Premium Pass"
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session');
      }

      // 🌟 পরিবর্তন: redirectToCheckout-এর পরিবর্তে সরাসরি স্ট্রাইপের দেওয়া সিকিউর ইউআরএল-এ রিডাইরেক্ট
      if (session.url) {
        window.location.href = session.url; 
      } else {
        throw new Error('Stripe checkout URL not found');
      }

    } catch (error) {
      console.error("Stripe Error:", error);
      alert(`Payment Error: ${error.message || 'Something went wrong!'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <span className="text-5xl">👑</span>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Go Premium</h2>
          <p className="mt-2 text-sm text-gray-600">
            Unlock unlimited recipe posts and share your culinary magic with everyone.
          </p>
        </div>

        {/* Pricing Card Details */}
        <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100 text-center">
          <p className="text-sm text-pink-700 font-semibold uppercase tracking-wide">Premium Pass</p>
          <p className="mt-2 text-4xl font-black text-gray-950">$4.99 <span className="text-sm font-normal text-gray-500">/ lifetime</span></p>
          <ul className="mt-4 text-sm text-gray-600 space-y-2 text-left list-disc list-inside pl-2">
            <li>Post unlimited recipes</li>
            <li>Get a verified chef badge</li>
            <li>Priority view on homepage</li>
          </ul>
        </div>

        {/* Stripe Gateway Box */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Payment Gateway</label>
          <div className="flex items-center justify-between p-4 rounded-xl border-2 border-pink-600 bg-pink-50/30">
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">Stripe Checkout</span>
              <span className="text-xs text-gray-500">You will be redirected to Stripe's secure site.</span>
            </div>
            <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-md font-medium">Official</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleProcessPayment}
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-pink-700 hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 transition-colors"
          >
            {loading ? "Redirecting to Stripe..." : "Pay Now with Stripe"}
          </button>
          
          <button
            onClick={() => router.back()}
            className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            Cancel and Go Back
          </button>
        </div>

      </div>
    </div>
  );
}