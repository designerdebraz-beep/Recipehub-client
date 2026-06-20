'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Search = ({ 
    onSearch, 
    placeholder = "Search...", 
    buttonText = "Search",
    className = "",
    initialValue = "",
    autoFocus = false,
    disabled = false,
    size = "md", // "sm", "md", "lg"
    variant = "primary", // "primary", "secondary", "outline"
    fullWidth = false,
    redirectPath = "/recipes" // Default redirect path
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState(initialValue);

    // If on the same page, just update the URL without full page reload
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Get the search term from state
        const searchValue = searchTerm.trim();
        
        if (searchValue) {
            // Call the onSearch callback if provided
            if (onSearch) {
                onSearch(searchValue);
            }
            
            // Check if we're already on the redirect path
            const currentPath = pathname || '';
            const targetPath = redirectPath;
            
            // If we're on the target page, just update the URL params
            if (currentPath === targetPath || currentPath.startsWith(targetPath)) {
                // Use router.replace to update URL without adding to history
                router.push(`${targetPath}?search=${encodeURIComponent(searchValue)}`);
            } else {
                // Navigate to the search page
                router.push(`${targetPath}?search=${encodeURIComponent(searchValue)}`);
            }
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
        }
    };

    // Size classes
    const sizeClasses = {
        sm: {
            input: "px-3 py-1.5 text-sm",
            button: "px-3 py-1.5 text-sm",
            clear: "text-sm",
            icon: "w-4 h-4"
        },
        md: {
            input: "px-4 py-2 text-base",
            button: "px-4 py-2 text-base",
            clear: "text-base",
            icon: "w-5 h-5"
        },
        lg: {
            input: "px-5 py-3 text-lg",
            button: "px-6 py-3 text-lg",
            clear: "text-lg",
            icon: "w-6 h-6"
        }
    };

    // Variant classes
    const variantClasses = {
        primary: {
            input: "border-blue-300 focus:border-blue-500 focus:ring-blue-200",
            button: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
            buttonDisabled: "bg-blue-300 cursor-not-allowed"
        },
        secondary: {
            input: "border-gray-300 focus:border-gray-500 focus:ring-gray-200",
            button: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
            buttonDisabled: "bg-gray-300 cursor-not-allowed"
        },
        outline: {
            input: "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            button: "bg-transparent hover:bg-blue-50 text-blue-600 border-2 border-blue-600 focus:ring-blue-500",
            buttonDisabled: "opacity-50 cursor-not-allowed"
        }
    };

    const selectedSize = sizeClasses[size] || sizeClasses.md;
    const selectedVariant = variantClasses[variant] || variantClasses.primary;

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`${fullWidth ? 'w-full' : 'w-auto'} ${className}`}
        >
            <div className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}>
                <div className="relative flex-1 min-w-[200px]">
                    <input
                        type="text"
                        name="search"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className={`
                            w-full
                            ${selectedSize.input}
                            border-2
                            rounded-lg
                            outline-none
                            transition-all
                            duration-200
                            ${selectedVariant.input}
                            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
                            focus:ring-4
                            pr-10
                        `}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        aria-label="Search"
                    />
                    
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className={`
                                absolute
                                right-2
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                                hover:text-gray-600
                                transition-colors
                                duration-200
                                ${selectedSize.clear}
                                p-1
                                rounded-full
                                hover:bg-gray-100
                            `}
                            aria-label="Clear search"
                        >
                            <svg 
                                className={selectedSize.icon} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M6 18L18 6M6 6l12 12" 
                                />
                            </svg>
                        </button>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={disabled || !searchTerm.trim()}
                    className={`
                        ${selectedSize.button}
                        font-medium
                        rounded-lg
                        transition-all
                        duration-200
                        focus:outline-none
                        focus:ring-4
                        whitespace-nowrap
                        ${disabled || !searchTerm.trim() ? selectedVariant.buttonDisabled : selectedVariant.button}
                        flex
                        items-center
                        gap-2
                    `}
                >
                    <svg 
                        className={selectedSize.icon} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                        />
                    </svg>
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default Search;