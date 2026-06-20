"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotFoundPage = () => {
    // Floating animation configuration for the main 404 text or elements
    const floatingAnimation = {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
            }
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-default-50 dark:bg-zinc-950 px-4 sm:px-6 transition-colors duration-300">
            
            {/* 🎨 ANIMATED CONTENT CONTAINER */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center max-w-md w-full"
            >
                {/* Huge 404 Badge with floating effect */}
                <motion.div 
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    className="select-none"
                >
                    <h1 className="text-8xl sm:text-9xl font-extrabold tracking-tighter text-[#ff6b6b] drop-shadow-sm">
                        404
                    </h1>
                </motion.div>

                {/* Header Titles */}
                <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-xl sm:text-2xl font-bold tracking-tight text-default-900 dark:text-white mt-4 mb-2"
                >
                    Lost in the Kitchen? 🍳
                </motion.h2>
                
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-xs sm:text-sm text-default-500 dark:text-zinc-400 mb-8 max-w-xs mx-auto"
                >
                    The recipe or page you are looking for doesn't exist or has been moved to another counter.
                </motion.p>

                {/* Interactive Action Buttons */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                        <Link 
                            href="/" 
                            className="block w-full text-center bg-[#ff6b6b] hover:bg-[#ff5252] text-white py-3 px-6 rounded-xl text-sm font-semibold transition-colors shadow-sm"
                        >
                            Back to Home
                        </Link>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                        <button 
                            onClick={() => window.history.back()}
                            className="w-full text-center bg-white dark:bg-zinc-900 text-default-800 dark:text-zinc-200 border border-default-200 dark:border-zinc-800 hover:bg-default-50 dark:hover:bg-zinc-800/60 py-3 px-6 rounded-xl text-sm font-semibold transition-all"
                        >
                            Go Back
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFoundPage;