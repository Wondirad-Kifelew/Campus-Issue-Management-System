'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/context';
import { FileText, ClipboardList, Globe, Bell } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow p-8 border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-slate-600 mb-6">
          You&apos;re logged in as a student. Use the menu on the left to navigate through the portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Submit Issue Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="mb-3">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Submit an Issue</h2>
            <p className="text-slate-700 mb-4">
              Report a campus issue and help us improve the student experience.
            </p>
          
            <Link href="/student/submit-issue" className="text-blue-600 hover:text-blue-700 font-semibold">
                   Start reporting →
           </Link>
          </div>

          {/* My Issues Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
            <div className="mb-3">
              <ClipboardList className="w-8 h-8 text-purple-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">My Issues</h2>
            <p className="text-slate-700 mb-4">
              Track the status of issues you&apos;ve submitted and manage them.
            </p>
            <Link href="/student/my-issues" className="text-blue-600 hover:text-blue-700 font-semibold">
                   View my issues →
           </Link>
          </div>

          {/* All Issues Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
            <div className="mb-3">
              <Globe className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">All Issues</h2>
            <p className="text-slate-700 mb-4">
              View campus-wide issues from all students and show your support.
            </p>
            <Link href="/student/all-issues" className="text-blue-600 hover:text-blue-700 font-semibold">
                   Explore all issues →
           </Link>
          </div>

          {/* Notifications Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
            <div className="mb-3">
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Notifications</h2>
            <p className="text-slate-700 mb-4">
              Stay updated on your issues and get staff replies in real-time.
            </p>
            <Link href="/student/notifications" className="text-blue-600 hover:text-blue-700 font-semibold">
                   check out notifications →
           </Link>
          </div>
        </div>
      </div>
    </div>
  );
}