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
                // FIX: use the onSuccess/onError callback pattern instead of relying
                // on the awaited promise + router.push race. better-auth's signIn
                // call resolves the network request, but the in-memory session
                // store (used by useSession()) may not have flushed to subscribers
                // yet when a Next.js soft navigation (router.push) fires right after.
                // We removed `callbackURL` here (it triggers better-auth's own
                // redirect attempt) to avoid a double-navigation conflict, and we
                // do a *hard* navigation on success so every component --
                // including the navbar -- remounts and refetches the session
                // from the server instead of reading a stale client cache.
                const { error } = await authClient.signIn.email({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) {
                    setErrors({ server: error.message || 'Invalid email or password.' });
                    setIsLoading(false);
                    return;
                }

                // Hard navigation: forces a full reload so the navbar (and any
                // other server/client component reading session state) fetches
                // fresh session data instead of relying on the client-side
                // session store having updated in time.
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
            // Google OAuth already does a full browser redirect through the
            // provider and back, so the page reloads naturally and session
            // state will be fresh on return. No change needed here, but we
            // keep callbackURL since better-auth's redirect flow depends on it.
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

    // Dynamic style computation for layout responsiveness
    const responsiveStyles = {
        ...styles.card,
        padding: isMobile ? '24px 16px' : '40px',
        margin: isMobile ? '10px' : '20px',      
        borderRadius: isMobile ? '8px' : '12px',
        boxShadow: isMobile ? '0 2px 8px rgba(0, 0, 0, 0.06)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
    };

    return (
        <div style={styles.container}>
            <div style={responsiveStyles}>
                <h2 style={styles.title}>Welcome Back 🍳</h2>
                <p style={styles.subtitle}>Log in to access your digital RecipeHub kitchen</p>

                {errors.server && (
                    <div style={styles.serverErrorMessage}>
                        {errors.server}
                    </div>
                )}

                {/* Credentials Form */}
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Email Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="chef@recipehub.com"
                            disabled={isLoading || isGoogleLoading}
                        />
                        {errors.email && <span style={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="••••••••"
                            disabled={isLoading || isGoogleLoading}
                        />
                        {errors.password && <span style={styles.errorText}>{errors.password}</span>}
                    </div>

                    <button 
                        type="submit" 
                        style={{...styles.button, opacity: isLoading ? 0.7 : 1}}
                        disabled={isLoading || isGoogleLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* Visual Separator */}
                <div style={styles.separatorContainer}>
                    <div style={styles.line}></div>
                    <span style={styles.separatorText}>OR</span>
                    <div style={styles.line}></div>
                </div>

                {/* Google Sign-in Alternative */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    style={{...styles.googleButton, opacity: isGoogleLoading ? 0.7 : 1}}
                    disabled={isLoading || isGoogleLoading}
                >
                    {/* Inline clean SVG icon asset for standard Google logotype symbol representation */}
                    <svg style={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f9fa',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        boxSizing: 'border-box',
        marginTop: '100px'
    },
    card: {
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '450px',
        boxSizing: 'border-box',
    },
    title: {
        margin: '0 0 5px 0',
        color: '#ff6b6b',
        textAlign: 'center',
        fontSize: 'calc(1.5rem + 0.5vw)',
    },
    subtitle: {
        margin: '0 0 25px 0',
        color: '#666',
        textAlign: 'center',
        fontSize: '14px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputGroup: {
        marginBottom: '18px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontWeight: '600',
        marginBottom: '6px',
        fontSize: '14px',
        color: '#333',
    },
    input: {
        padding: '12px 14px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    errorText: {
        color: '#e74c3c',
        fontSize: '12px',
        marginTop: '5px',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '14px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
        boxSizing: 'border-box',
    },
    separatorContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '25px 0',
    },
    line: {
        flex: 1,
        height: '1px',
        backgroundColor: '#e0e0e0',
    },
    separatorText: {
        margin: '0 10px',
        color: '#888',
        fontSize: '12px',
        fontWeight: '600',
    },
    googleButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        color: '#333',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '12px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        width: '100%',
        boxSizing: 'border-box',
    },
    googleIcon: {
        marginRight: '10px',
    },
    serverErrorMessage: {
        backgroundColor: '#fde8e8',
        color: '#e74c3c',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        border: '1px solid #f8b4b4'
    }
};

export default LoginPage;
