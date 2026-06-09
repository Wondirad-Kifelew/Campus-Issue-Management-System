'use client';

import { useState } from 'react';
import { useIssue, useAuth } from '@/lib/context';
import { Issue, IssueCategory, IssueStatus } from '@/lib/types';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

const categoryColors: Record<IssueCategory, string> = {
  Infrastructure: 'bg-indigo-100 text-indigo-700',
  Cleanliness: 'bg-cyan-100 text-cyan-700',
  Technology: 'bg-purple-100 text-purple-700',
  Safety: 'bg-red-100 text-red-700',
  Cafeteria: 'bg-yellow-100 text-yellow-700',
  Others: 'bg-gray-100 text-gray-700',
};

export default function StaffIssuesPage() {
  const { issues } = useIssue();
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date' | 'urgency'>('date');

  // Filter issues - show only issues in staff's assigned category
  let filteredIssues = issues.filter((issue) => {
    const statusMatch = statusFilter === 'All' || issue.status === statusFilter;
    const staffCategoryMatch = !user?.staffCategory || issue.category === user.staffCategory;
    const categoryMatch = categoryFilter === 'All' || issue.category === categoryFilter;
    return statusMatch && staffCategoryMatch && categoryMatch;
  });

  // Sort issues
  if (sortBy === 'urgency') {
    filteredIssues.sort((a, b) => b.agreementCount - a.agreementCount);
  } else {
    filteredIssues.sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());
  }

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Issues</h1>
        <p className="text-slate-600">
          Review and respond to student-submitted issues
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as IssueStatus | 'All');
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Filter by Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Category:
            </label>
            <div className="w-full flex items-center justify-center px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 text-sm">
              {user?.staffCategory ? (
                <span className={`gap-2 px-3 py-1 rounded-full text-sm font-bold ${categoryColors[user.staffCategory]}`}>
                  {user.staffCategory}
                </span>
              ) : (
                <span className="text-slate-500">No category assigned</span>
              )}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'urgency')}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="date">Date (Newest)</option>
              <option value="urgency">Urgency (Most Agreed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 px-6">
            <p className="text-slate-600">No issues found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Issue Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedIssues.map((issue, key) => (
                    <tr key={key} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        <a
                          href={`/staff/issues/${issue?.id}`}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {issue?.title.length > 30 ? issue?.title.substring(0, 30) + '...' : issue?.title}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            categoryColors[issue?.category]
                          }`}
                        >
                          {issue?.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[issue?.status]
                          }`}
                        >
                          {issue?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {issue?.submittedDate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/staff/issues/${issue?.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
