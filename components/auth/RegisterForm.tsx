'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context';

export function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'staff'>('student');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  useEffect(() => {
    const roleParam = searchParams.get('role') as 'student' | 'staff' | null;
    if (roleParam === 'student' || roleParam === 'staff') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!fullName || !userId || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      await register(fullName, userId, password, role);
      router.push(role === 'staff' ? '/staff' : '/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
          <p className="text-center text-slate-600 mb-1">Create your account</p>
          <p className="text-center text-sm font-medium text-blue-600 mb-2">
            {role === 'student' ? 'Student Portal' : 'Staff Portal'}
          </p>
          <p className="text-center text-sm text-slate-500 mb-8">
            *Note: Enter your student/staff ID in the User ID field
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-slate-600">
            Do you have an account?{' '}
            <Link href={`/login?role=${role}`} className="text-blue-600 font-semibold hover:underline">
              Login
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
