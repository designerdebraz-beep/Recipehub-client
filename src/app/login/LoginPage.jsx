"use client"
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Determine the redirect destination: explicit callback routing URL fallback to home path ('/')
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    // State to track if the screen is mobile size (< 480px)
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 480);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Error states
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Validate email & password format
    const validateForm = () => {
        const newErrors = {};
        const { email, password } = formData;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        return newErrors;
    };

    // Handle standard Credentials Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            setErrors({});
            setIsLoading(true);

            try {
                const { error } = await authClient.signIn.email({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) {
                    setErrors({ server: error.message || 'Invalid email or password.' });
                    setIsLoading(false);
                    return;
                }

                window.location.href = callbackUrl;
            } catch (error) {
                console.error("Credentials Login Error:", error);
                setErrors({ server: error.message || 'Invalid email or password.' });
                setIsLoading(false);
            }
        } else {
            setErrors(validationErrors);
        }
    };

    // Handle Google OAuth Login
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        setErrors({});
        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: callbackUrl,
            });
        } catch (error) {
            console.error("Google Login Error:", error);
            setErrors({ server: error.message || 'Google sign-in failed. Please try again.' });
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-default-50 dark:bg-zinc-950 px-4 sm:px-6 pt-24 pb-12 transition-colors">
            {/* 🛡️ RESPONSIVE CARD CONTAINER */}
            <div className="w-full max-w-[450px] bg-white dark:bg-zinc-900 rounded-xl md:rounded-2xl border border-divider/40 p-6 sm:p-10 shadow-sm md:shadow-md transition-all">
                
                {/* Header */}
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center text-[#ff6b6b] mb-1.5">
                    Welcome Back 🍳
                </h2>
                <p className="text-xs sm:text-sm text-default-500 dark:text-zinc-400 text-center mb-6 sm:mb-8">
                    Log in to access your digital RecipeHub kitchen
                </p>

                {/* Server Error Message Popup */}
                {errors.server && (
                    <div className="bg-danger-50 dark:bg-danger-950/20 text-danger border border-danger-200 dark:border-danger-900/30 p-3 rounded-xl mb-5 text-xs sm:text-sm text-center font-medium">
                        {errors.server}
                    </div>
                )}

                {/* Credentials Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-default-800 dark:text-zinc-200">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-default-200 dark:border-zinc-800 bg-transparent text-default-900 dark:text-white placeholder:text-default-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm sm:text-base disabled:opacity-50"
                            placeholder="chef@recipehub.com"
                            disabled={isLoading || isGoogleLoading}
                        />
                        {errors.email && (
                            <span className="text-danger text-xs font-medium mt-0.5 pl-1">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs sm:text-sm font-semibold text-default-800 dark:text-zinc-200">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border border-default-200 dark:border-zinc-800 bg-transparent text-default-900 dark:text-white placeholder:text-default-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm sm:text-base disabled:opacity-50"
                            placeholder="••••••••"
                            disabled={isLoading || isGoogleLoading}
                        />
                        {errors.password && (
                            <span className="text-danger text-xs font-medium mt-0.5 pl-1">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all shadow-sm active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-2"
                        disabled={isLoading || isGoogleLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* Visual Separator */}
                <div className="flex items-center my-6 sm:my-8">
                    <div className="flex-1 h-[1px] bg-divider/60"></div>
                    <span className="mx-3 text-default-400 text-xs font-bold tracking-wider">OR</span>
                    <div className="flex-1 h-[1px] bg-divider/60"></div>
                </div>

                {/* Google Sign-in Alternative */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2.5 bg-white dark:bg-zinc-800 text-default-800 dark:text-zinc-200 border border-default-200 dark:border-zinc-700 hover:bg-default-50 dark:hover:bg-zinc-700/50 py-2.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold transition-all active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
                    disabled={isLoading || isGoogleLoading}
                >
                    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>
                        {isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;