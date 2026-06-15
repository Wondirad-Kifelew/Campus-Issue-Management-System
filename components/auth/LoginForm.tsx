'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context';
import { GraduationCap, Users, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner'; // [INTEGRATED] Toast notifications for feedback

const roleConfig = {
  student: {
    label: "Student's Portal",
    idLabel: 'Student ID',
    idPlaceholder: 'E.g. NSE/8989/15',
    icon: GraduationCap,
    desc: 'Submit and track campus issues',
  },
  staff: {
    label: "Staff's Portal",
    idLabel: 'Staff ID',
    idPlaceholder: 'E.g. STAFF001',
    icon: Users,
    desc: 'Resolve and manage reported issues',
  },
  admin: {
    label: "Admin's Portal",
    idLabel: 'Admin ID',
    idPlaceholder: 'E.g. ADMIN001',
    icon: Shield,
    desc: 'Manage users and system settings',
  },
};

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
      if (!userId || !password) throw new Error('Please fill in all fields');
        if(role === 'student' && !/^[a-zA-Z]{3}\/\d{4}\/\d{2}$/.test(userId)){
            throw new Error('Student ID must be in the format ABC/1234/56');
        }
      if (password.length < 6) throw new Error('Password must be at least 6 characters');
      
      // [INTEGRATED] Call API login instead of mock - shows spinner during request
      await login(userId, password, role);
      
      // [INTEGRATED] Show success toast and redirect
      toast.success('Login successful!');
      router.push(role === 'staff' ? '/staff' : role === 'admin' ? '/admin' : '/student');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      // [INTEGRATED] Show error toast for API failures
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const cfg = roleConfig[role];
  const RoleIcon = cfg.icon;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel: brand (identical to RoleSelector) ── */}
      <div
        className="relative flex flex-col items-center justify-center md:w-1/2 min-h-[280px] md:min-h-screen px-10 py-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #003DA5 0%, #002d7a 60%, #001e52 100%)' }}
      >
        {/* decorative rings */}
        <div
          className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 520, height: 520, border: '2px solid #fff', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
        <div
          className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 700, height: 700, border: '1.5px solid #fff', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        />
        {/* yellow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#F5C518' }} />

        {/* logo */}
        <div className="relative z-10 mb-8 drop-shadow-2xl">
          <div
            className="rounded-full p-3"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', border: '2px solid rgba(255,255,255,0.25)' }}
          >
            <Image
              src="/cropped_logo.png"
              alt="Resolv logo"
              width={144}
              height={144}
              className="rounded-full object-contain"
              priority
            />
          </div>
        </div>

        {/* wordmark */}
        <div className="relative z-10 text-center space-y-2">
          <p
            className="tracking-widest text-l font-semibold uppercase"
            style={{ color: '#F5C518', fontFamily: "'Georgia', serif", letterSpacing: '0.2em' }}
          >
            Resolv
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Georgia', serif", textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
          >
            Student's Issue
            <br />
            Management System
          </h1>
          <div className="mx-auto mt-3" style={{ width: 48, height: 3, background: '#F5C518', borderRadius: 2 }} />

          {/* active role pill */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              <RoleIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{cfg.label}</span>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-2">{cfg.desc}</p>
        </div>
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex flex-col items-center justify-center md:w-1/2 min-h-screen bg-white px-8 py-16">
        <div className="w-full max-w-sm">

          {/* back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#003DA5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to role selection
          </Link>

          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: '#1a1a1a', fontFamily: "'Georgia', serif" }}
          >
            Sign in
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
            Enter your credentials to access the{' '}
            <span style={{ color: '#003DA5', fontWeight: 600 }}>{cfg.label.toLowerCase()}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* User ID */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                {cfg.idLabel}
              </label>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder={cfg.idPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={{
                  border: '1.5px solid #e5e7eb',
                  color: '#111827',
                  background: '#fafafa',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#003DA5';
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={{
                  border: '1.5px solid #e5e7eb',
                  color: '#111827',
                  background: '#fafafa',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#003DA5';
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FFF5F6', border: '1px solid #fecdd3', color: '#be123c' }}
              >
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{
                background: isLoading ? '#e5a0ab' : '#003DA5',
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#01296e'; }}
              onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#003DA5'; }}
            >
              {isLoading ? 'Signing in…' : (
                <>
                  Log in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* register */}
          <p className="text-center mt-8 text-sm" style={{ color: '#6b7280' }}>
            {
              role === 'admin' || role === 'staff' ? 
              "" : (
                <>
              Don't have an account?{" "}
              <Link
              href={`/register?role=${role}`}
              className="font-semibold transition-colors"
              style={{ color: '#003DA5' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              Register
            </Link> </>)
              }
          
            
            
          </p>

          
        </div>
      </div>

    </div>
  );
}
