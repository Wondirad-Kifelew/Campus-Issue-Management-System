'use client';

import { useEffect } from 'react';
import { useAuth, useAdmin } from '@/lib/context';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { stats, isLoadingStats, fetchStats } = useAdmin();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalUsers = stats?.totalUsers || 0;
  const totalStaffs = stats?.totalStaffs || 0;
  const totalStudents = stats?.totalStudents || 0;
  const totalIssues = stats?.totalIssues || 0;

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
