"use client";

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // 👑 searchParams এর জন্য ইমপোর্ট করা হলো
import { authClient } from '@/lib/auth-client';

// Next.js এ useSearchParams ব্যবহার করলে পুরো কম্পোনেন্টকে Suspense এর ভেতর রাখা বেস্ট প্র্যাকটিস
const SuccessPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams(); // 👑 এখানে searchParams ডিক্লেয়ার করা হলো

    const [loading, setLoading] = useState(true);
    const [txId, setTxId] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const BasedUrl = process.env.BasedUrl || process.env.NEXT_PUBLIC_BASED_URL || 'http://localhost:5000';

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const paymentStatus = searchParams.get('payment');

            // ইউআরএল এ যদি ?payment=success থাকে অথবা ডিরেক্ট সাকসেস পেজে আসলে
            if (paymentStatus === 'success' || !paymentStatus) {
                try {
                    const { data: sessionData } = await authClient.getSession();
                    const userEmail = sessionData?.user?.email;

                    // 🚨 ইমেইল না পাওয়া পর্যন্ত অপেক্ষা করবে
                    if (!userEmail) {
                        console.log("Waiting for user email from session...");
                        return;
                    }

                    const generatedTxId = `ST_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
                    setTxId(generatedTxId);

                    const paymentPayload = {
                        email: userEmail,
                        amount: 4.99,
                        packageName: "Premium Pass (PRO)",
                        transactionId: generatedTxId
                    };

                    const { data: token } = await authClient.token(); // ফ্রন্টএন্ডে টোকেন নিন

                    const response = await fetch(`${BasedUrl}/api/payments/confirm`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `bearer ${token.token}`
                        },
                        body: JSON.stringify(paymentPayload)
                    });

                    if (response.ok) {
                        setIsSuccess(true);
                    }
                } catch (error) {
                    console.error("Error saving payment transaction:", error);
                } finally {
                    setLoading(false); // ডাটা লোড বা এপিআই হিট শেষ হলে লোডিং ফলস হবে
                }
            } else {
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [searchParams, BasedUrl]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-pink-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-600 font-medium text-sm">Verifying payment & activating PRO features...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8 text-center">

                {/* Success Checkmark Icon */}
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-50 text-green-500 mb-6 border-4 border-green-100 animate-pulse">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                    Payment Successful!
                </h2>
                <p className="text-gray-500 text-sm mb-8 px-2">
                    Thank you for your purchase! Your account has been upgraded to <span className="font-bold text-pink-700">PRO Plan</span>. Now you can share your unlimited culinary magic.
                </p>

                {/* Transaction Receipt Box */}
                <div className="bg-gray-50 rounded-2xl p-5 text-left border border-gray-100 space-y-3 mb-8 text-sm">
                    <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
                        <span className="text-gray-400 font-medium">Package</span>
                        <span className="text-gray-800 font-bold">Premium Pass (PRO)</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
                        <span className="text-gray-400 font-medium">Amount Paid</span>
                        <span className="text-green-600 font-black text-base">$4.99 USD</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200/60 pb-2.5">
                        <span className="text-gray-400 font-medium">Access</span>
                        <span className="text-gray-800 font-medium">Unlimited Posting</span>
                    </div>
                    <div className="flex justify-between pt-1">
                        <span className="text-gray-400 font-medium">Transaction ID</span>
                        <span className="font-mono font-bold text-gray-700 text-xs bg-gray-200/60 px-2.5 py-1 rounded-md">
                            {txId || "PROCESSING..."}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Link
                        href="/dashboard/user/addrecipe"
                        className="w-full bg-pink-700 text-white font-semibold py-4 rounded-xl hover:bg-pink-800 shadow-lg shadow-pink-700/20 transition-all active:scale-[0.99] text-center text-sm"
                    >
                        Start Posting Recipes 🍳
                    </Link>

                    <Link
                        href="/"
                        className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>

            </div>
        </div>
    );
};

// 👑 Next.js static build এর এরর এড়াতে কম্পোনেন্টটিকে Suspense দিয়ে র‍্যাপ করে এক্সপোর্ট করা হলো
export default function Sucesspage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-pink-700 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        }>
            <SuccessPageContent />
        </Suspense>
    );
}