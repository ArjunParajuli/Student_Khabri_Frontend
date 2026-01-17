'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await fetcher('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            router.push('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await fetcher('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: 'test@gmail.com', password: 'Test@123' }),
            });
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Guest login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
                {error && <div className="bg-red-500/50 text-white p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/80 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-transparent text-white/60">Or</span>
                    </div>
                </div>

                <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg border border-white/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                    Explore App as Guest
                </button>
                <p className="mt-6 text-center text-white/60 text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-white font-semibold hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
