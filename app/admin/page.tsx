'use client';

import { useAuth, useIssue } from '@/lib/context';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { issues } = useIssue();

  // Mock data for admin dashboard
  const totalUsers = 1278;
  const totalStaffs = 32;
  const totalStudents = 1246;
  const totalIssues = 212;

  return (
    <div className="max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600 mb-8">Some overall stats</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total users</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{totalUsers}</p>
          </div>

          {/* Total Staffs Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Staffs</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{totalStaffs}</p>
          </div>

          {/* Total Students Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Students</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{totalStudents}</p>
          </div>

          {/* Total Issues Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <p className="text-slate-600 text-sm font-medium">Total Issues</p>
            <p className="text-4xl font-bold text-slate-900 mt-2">{totalIssues}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
