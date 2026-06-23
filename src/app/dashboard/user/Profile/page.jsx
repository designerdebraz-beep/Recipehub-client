import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FormModel } from '@/component/Dashboard/FormModel';

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  const user = session?.user;
  console.log(user)
  
  // If no user, redirect to login
  if (!user) {
    redirect('/login');
  }

  const res = await fetch(
    `http://localhost:5000/api/my-recipes/${user.id}`,
    {
      cache: "no-store"
    }
  );

  const recipes = await res.json();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          
          {/* Cover Image / Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover w-32 h-32"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {getInitials(user.name)}
                    </span>
                  </div>
                )}
                
                {/* Online Status */}
                <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
            </div>

            {/* User Details */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
              
              {/* Badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                  {user.role || 'User'}
                </span>
                
                {/* 🔥 PRO Verified Badge – Golden & Shiny */}
                {user.plan === 'pro' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md shadow-yellow-500/30">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Premium User
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5" />
                    {user.plan || 'Free'}
                  </span>
                )}

                
              </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white"> {recipes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recipes</p>
              </div>
              <div className="text-center border-x border-gray-200 dark:border-gray-600">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDate(user.createdAt) !== 'N/A' ? '✓' : '0'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</span>
                <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{user.id}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</span>
                <span className="text-sm text-gray-900 dark:text-white">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">{user.plan || 'Free'}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</span>
                <span className="text-sm text-gray-900 dark:text-white capitalize">{user.role || 'User'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 text-center">
              <div className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <FormModel />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Welcome to the platform!</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Account created successfully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;