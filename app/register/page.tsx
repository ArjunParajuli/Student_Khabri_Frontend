'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/lib/api';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await fetcher('/auth/register', {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
                {error && <div className="bg-red-500/50 text-white p-3 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div>
                        <label className="block text-white/80 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
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
                    Already have an account?{' '}
                    <Link href="/login" className="text-white font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
