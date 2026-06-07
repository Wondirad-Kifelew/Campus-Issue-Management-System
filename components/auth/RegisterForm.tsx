'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context';
import { GraduationCap, Users, ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
};

const inputBase: React.CSSProperties = {
  border: '1.5px solid #e5e7eb',
  color: '#111827',
  background: '#fafafa',
};

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
    if (roleParam === 'student' || roleParam === 'staff') setRole(roleParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (!fullName || !userId || !password || !confirmPassword)
        throw new Error('Please fill in all fields');
      if (password.length < 6)
        throw new Error('Password must be at least 6 characters');
      if (password !== confirmPassword)
        throw new Error('Passwords do not match');
      
      // [INTEGRATED] Call API register instead of mock - shows spinner during request
      await register(fullName, userId, password, role);
      
      // [INTEGRATED] Show success toast and redirect
      toast.success('Account created successfully!');
      router.push(role === 'staff' ? '/staff' : '/student');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMsg);
      // [INTEGRATED] Show error toast for API failures
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#003DA5';
    e.currentTarget.style.background = '#fff';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,16,46,0.08)';
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#e5e7eb';
    e.currentTarget.style.background = '#fafafa';
    e.currentTarget.style.boxShadow = 'none';
  };

  const cfg = roleConfig[role];
  const RoleIcon = cfg.icon;

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel: brand ── */}
      <div
        className="relative flex flex-col items-center justify-center md:w-1/2 min-h-[280px] md:min-h-screen px-10 py-16 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #003DA5 0%, #002d7a 60%, #001e52 100%)' }}
      >
        <div className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 520, height: 520, border: '2px solid #fff', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute rounded-full opacity-10 pointer-events-none"
          style={{ width: 700, height: 700, border: '1.5px solid #fff', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#F5C518' }} />

        <div className="relative z-10 mb-8 drop-shadow-2xl">
          <div className="rounded-full p-3"
            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)', border: '2px solid rgba(255,255,255,0.25)' }}>
            <Image src="/cropped_logo.png" alt="Addis Ababa University logo"
              width={144} height={144} className="rounded-full object-contain" priority />
          </div>
        </div>

        <div className="relative z-10 text-center space-y-2">
          <p className="tracking-widest text-xs font-semibold uppercase"
            style={{ color: '#F5C518', fontFamily: "'Georgia', serif", letterSpacing: '0.2em' }}>
            Addis Ababa University
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Georgia', serif", textShadow: '0 2px 12px rgba(0,0,0,0.35)' }}>
            Student's Issue<br />Management System
          </h1>
          <div className="mx-auto mt-3" style={{ width: 48, height: 3, background: '#F5C518', borderRadius: 2 }} />

          {/* role pill */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <RoleIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{cfg.label}</span>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-2">{cfg.desc}</p>
        </div>
      </div>

      {/* ── Right panel: register form ── */}
      <div className="flex flex-col items-center justify-center md:w-1/2 min-h-screen bg-white px-8 py-16">
        <div className="w-full max-w-sm">

          {/* back link */}
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#003DA5')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to role selection
          </Link>

          <h2 className="text-2xl font-bold mb-1"
            style={{ color: '#1a1a1a', fontFamily: "'Georgia', serif" }}>
            Create account
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
            Register as a{' '}
            <span style={{ color: '#003DA5', fontWeight: 600 }}>{role}</span> to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                Full name
              </label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            {/* User ID */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                {cfg.idLabel}
              </label>
              <input type="text" value={userId} onChange={e => setUserId(e.target.value)}
                placeholder={cfg.idPlaceholder}
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
              <p className="text-xs mt-1.5" style={{ color: '#9ca3af' }}>
                Use your official {role} ID issued by the university
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: '#374151' }}>
                Confirm password
              </label>
              <div className="relative">
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none pr-10"
                  style={inputBase} onFocus={focusStyle} onBlur={blurStyle} />
                {passwordsMatch && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: '#dcfce7' }}>
                    <Check className="w-3 h-3" style={{ color: '#16a34a' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#FFF5F6', border: '1px solid #fecdd3', color: '#be123c' }}>
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all"
              style={{ background: isLoading ? '#e5a0ab' : '#003DA5', cursor: isLoading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#01296e'; }}
              onMouseLeave={e => { if (!isLoading) (e.currentTarget as HTMLButtonElement).style.background = '#003DA5'; }}>
              {isLoading ? 'Creating account…' : (
                <><ArrowRight className="w-4 h-4" />Create account</>
              )}
            </button>
          </form>

          {/* login link */}
          <p className="text-center mt-8 text-sm" style={{ color: '#6b7280' }}>
            Already have an account?{' '}
            <Link href={`/login?role=${role}`} className="font-semibold transition-colors"
              style={{ color: '#003DA5' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
              Sign in
            </Link>
          </p>

          <p className="mt-10 text-center text-xs" style={{ color: '#d1d5db' }}>
            © {new Date().getFullYear()} Addis Ababa University · All rights reserved
          </p>
        </div>
      </div>

    </div>
  );
}
