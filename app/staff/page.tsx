'use client';

import { useAuth, useIssue } from '@/lib/context';
import { ClipboardList, Clock, LoaderCircle , FolderOpen, BarChart2 } from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { issues } = useIssue();

  const totalIssues = issues.length;
  const pendingIssues = issues.filter(issue => issue.status === 'Pending').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length;

  return (
    <div className="max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600 mb-8">Manage and respond to your assigned issues</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Issues Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Assigned Issues</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalIssues}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Pending Issues Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending Issues</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{pendingIssues}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{inProgressIssues}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <LoaderCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* View Issues Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
            <div className="mb-3">
              <FolderOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Review Issues</h2>
            <p className="text-slate-700 mb-4">
              View all submitted issues and provide responses to students.
            </p>
            <a href="/staff/issues" className="text-blue-600 hover:text-blue-700 font-semibold">
              Go to issues →
            </a>
          </div>

          {/* Statistics Card */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <div className="mb-3">
              <BarChart2 className="w-8 h-8 text-slate-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Stats</h2>
            <p className="text-slate-700 mb-4">
              {pendingIssues} issues are waiting for your response. Keep up the good work!
            </p>
            <a href="/staff/issues" className="text-blue-600 hover:text-blue-700 font-semibold">
              View pending →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}