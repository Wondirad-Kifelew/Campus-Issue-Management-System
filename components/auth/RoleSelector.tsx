'use client';

import Link from 'next/link';
import { GraduationCap, Users, Shield } from 'lucide-react';

export function RoleSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Title */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">
            AAU Students Issue Management
          </h1>
          <p className="text-center text-slate-600 mb-8">Select your role to continue</p>

          {/* Role Selection Cards */}
          <div className="space-y-3 grid grid-cols-1">
            {/* Student Role */}
            <Link href="/login?role=student">
              <button className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-all group">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Student</h3>
                    <p className="text-sm text-slate-600">Submit and track issues</p>
                  </div>
                </div>
              </button>
            </Link>

            {/* Staff Role */}
            <Link href="/login?role=staff">
              <button className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-all group">
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Staff</h3>
                    <p className="text-sm text-slate-600">Resolve and manage issues</p>
                  </div>
                </div>
              </button>
            </Link>

            {/* Admin Role */}
            <Link href="/login?role=admin">
              <button className="w-full p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-all group">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <h3 className="font-semibold text-slate-900">Admin</h3>
                    <p className="text-sm text-slate-600">Manage users and settings</p>
                  </div>
                </div>
              </button>
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
}
