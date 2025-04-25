'use client';
import Link from 'next/link';
import { useState} from 'react';
import {useRouter} from 'next/navigation';
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
import { SyncLoader } from 'react-spinners';
import { CircleAlert } from "lucide-react";
import { toast } from "sonner"
import {useAuthStore} from "@/store/authStore";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('customer');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [error, setError] = useState(null);
    const login = useAuthStore((state) => state.login);
    const register = useAuthStore((state) => state.register);
    const router = useRouter();
    const override = {
        display: "block",
        margin: "0 auto",
        borderColor: "rgba(0, 0, 0, 0.3)",
    };
    
    const handleLogin = async (e) => { 
        e.preventDefault();
        setLoading(true);
        try {
            const success = await login(email, password);
            if (success){
                router.push('/');
                toast.success('Login successful');
            } else{
                setError('Please check your credentials and try again.');
            }
        }catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
        }finally{
            setLoading(false);
        }
    }
    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await register(first_name, last_name, registerEmail, registerPassword);
            if (response.ok){
                toast.success('Registration successful. You can now log in.');
                router.push('/login');  
            }else{
                setError(response.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function AlertMessage(){
        return (
           <Alert className={"bg-red-900"}>
            <div className = {"flex items-center gap-3"}>
                <div>
                    <CircleAlert size={40} strokeWidth={2} color='#ffffff'/>
                </div>
                <div>
                    <AlertTitle className={"text-white text-lg"}>Error</AlertTitle> 
                    <AlertDescription className={"text-white text-nowrap"}>{error}</AlertDescription>
                </div>
                
            </div>
           </Alert>
        )
     }
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
           
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
                {error !== null ? <AlertMessage/> : null } 
                {/* Customer Login Form */}
                {activeTab === 'customer' && (
                    <div className="mt-8 bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-serif font-medium mb-2">Customer Login</h2>
                        <p className="text-sm text-gray-600 mb-6">Enter your email and password to access your account</p>
                        
                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange = {(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            {loading && (
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] w-screen h-screen">
                                    <SyncLoader
                                        color="#8B4513"
                                        loading={loading}
                                        cssOverride={override}
                                        size={12}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            )}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-xs text-[var(--primary-color)] hover:underline">Forgot password?</a>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value = {password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        
                        <form className="space-y-6" onSubmit={handleSignup}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        value={first_name}
                                        onChange={(e) => setFirstName(e.target.value)}
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
                                        value={last_name}
                                        onChange={(e) => setLastName(e.target.value)}
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
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]"
                                />
                            </div>
                            {loading && (
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] w-screen h-screen">
                                    <SyncLoader
                                        color="#8B4513"
                                        loading={loading}
                                        cssOverride={override}
                                        size={12}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="signupPassword"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value = {registerPassword}
                                    onChange = {(e) => setRegisterPassword(e.target.value)}
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
                            {loading && (
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] w-screen h-screen">
                                    <SyncLoader
                                        color="#8B4513"
                                        loading={loading}
                                        cssOverride={override}
                                        size={12}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>
                            )}
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
 