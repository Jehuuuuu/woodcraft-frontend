'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
    const [activeTab, setActiveTab] = useState('customer');
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-serif">
                        <span className="text-[var(--primary-color)] font-bold">Hufano</span> <span className="text-gray-500">Handicraft</span>
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account or create a new one
                    </p>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex rounded-md shadow-sm mt-6">
                    <button
                        onClick={() => setActiveTab('customer')}
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-l-md ${activeTab === 'customer' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Customer
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium ${activeTab === 'signup' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => setActiveTab('admin')}
                        className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-r-md ${activeTab === 'admin' ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Admin
                    </button>
                </div>
                
                {/* Customer Login Form */}
                {activeTab === 'customer' && (
                    <div className="mt-8 bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-serif font-medium mb-2">Customer Login</h2>
                        <p className="text-sm text-gray-600 mb-6">Enter your email and password to access your account</p>
                        
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-[var(--primary-color)] hover:underline">Forgot password?</a>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                    <div className="mt-8 bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-serif font-medium mb-2">Create Account</h2>
                        <p className="text-sm text-gray-600 mb-6">Fill in your details to create a new account</p>
                        
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="signupEmail"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="signupPassword"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                                >
                                    Create Account
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Admin Login Form */}
                {activeTab === 'admin' && (
                    <div className="mt-8 bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-serif font-medium mb-2">Admin Login</h2>
                        <p className="text-sm text-gray-600 mb-6">Enter your credentials to access admin panel</p>
                        
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="adminEmail"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-[var(--primary-color)] hover:underline">Forgot password?</a>
                                </div>
                                <input
                                    id="adminPassword"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)]"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Returning to store? <Link href="/" className="text-[var(--primary-color)] hover:underline">Back to homepage</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}