'use client';

import Link from 'next/link';
import { GraduationCap, Users, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const roles = [
  {
    href: '/login?role=student',
    icon: GraduationCap,
    label: 'Student',
    desc: 'Submit and track issues',
  },
  {
    href: '/login?role=staff',
    icon: Users,
    label: 'Staff',
    desc: 'Resolve and manage issues',
  },
  {
    href: '/login?role=admin',
    icon: Shield,
    label: 'Admin',
    desc: 'Manage users and settings',
  },
];

export function RoleSelector() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel: brand ── */}
      <div
        className="relative flex flex-col items-center justify-center md:w-1/2 min-h-[320px] md:min-h-screen px-10 py-16 overflow-hidden"
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
        {/* yellow accent bar top */}
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
            className="tracking-[0.22em] text-l font-semibold uppercase"
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
          <p className="text-white/70 text-sm mt-4 max-w-xs leading-relaxed">
            Report, track, and resolve campus issues — all in one place.
          </p>
        </div>
      </div>

      {/* ── Right panel: role selector ── */}
      <div className="flex flex-col items-center justify-center md:w-1/2 min-h-screen bg-white px-8 py-16">
        {/* yellow top accent on mobile */}
        <div className="absolute top-0 right-0 left-0 md:hidden h-1" style={{ background: '#F5C518' }} />

        <div className="w-full max-w-sm">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: '#1a1a1a', fontFamily: "'Georgia', serif" }}
          >
            Welcome back
          </h2>
          <p className="text-sm mb-10" style={{ color: '#6b7280' }}>
            Select your role to continue
          </p>

          <div className="flex flex-col gap-4">
            {roles.map(({ href, icon: Icon, label, desc }) => (
              <Link key={label} href={href} className="group block">
                <div
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-200 group-hover:shadow-md"
                  style={{
                    borderColor: '#e5e7eb',
                    background: '#fff',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#003DA5';
                    (e.currentTarget as HTMLDivElement).style.background = '#FFF5F6';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
                    (e.currentTarget as HTMLDivElement).style.background = '#fff';
                  }}
                >
                  {/* icon badge */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors duration-200"
                    style={{ background: '#FEF0F0' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: '#003DA5' }} />
                  </div>

                  {/* text */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#111827' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{desc}</p>
                  </div>

                  {/* arrow */}
                  <ArrowRight
                    className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    style={{ color: '#003DA5' }}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* footer */}
          
        </div>
      </div>

    </div>
  );
}