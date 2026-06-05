'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';

export function LoginForm() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'staff' | 'admin'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const roleParam = searchParams.get('role') as 'student' | 'staff' | 'admin' | null;
    if (roleParam === 'student' || roleParam === 'staff' || roleParam === 'admin') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!userId || !password) {
        throw new Error('Please fill in all fields');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await login(userId, password, role);
      if (role === 'staff') {
        router.push('/staff');
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-200">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">
            AAU Students Issue Management
          </h1>
          <p className="text-center text-slate-600 mb-1">Sign in to your account</p>
          <p className="text-center text-sm font-medium text-blue-600 mb-8">
            {role === 'student' ? 'Student Portal' : role === 'staff' ? 'Staff Portal' : 'Admin Portal'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               {role === 'student' ? 'Student ID' : role === 'staff' ? 'Staff ID' : 'Admin ID'}
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={role === 'student' ? 'E.g. NSE/8989/15' : 'ST1234'}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-slate-600">
            Don&apos;t have an account?{' '}
            <Link href={`/register?role=${role}`} className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>

          {/* Back Button */}
          <div className="text-center mt-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Back to role selection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
