'use client';

import { useState, useMemo } from 'react';
import { useAuth, useIssue } from '@/lib/context';
import { IssueCategory } from '@/lib/types';
import { IssueGrid } from '@/components/student/IssueGrid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function AllIssuesPage() {
  // const { user } = useIssue();
  const { issues, agreeWithIssue, categories } = useIssue();
  const authUser = useAuth().user;

  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'most-agreed'>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    let filtered = issues;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((issue) => issue.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'most-agreed') {
      filtered = [...filtered].sort((a, b) => b.agreementCount - a.agreementCount);
    } else {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
      );
    }

    return filtered;
  }, [issues, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIssues = filteredAndSorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  const handleCategoryChange = (category: IssueCategory | 'All') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'newest' | 'most-agreed') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const agreedIssueIds = issues
    .filter((issue) => issue?.agreedBy.includes(authUser?.userId || ''))
    .map((issue) => issue.id);

  // [INTEGRATED] Call API to toggle agreement
  const handleAgree = async (issueId: string) => {
    
    if (authUser?.userId) {
      await agreeWithIssue(issueId, authUser.userId);
      window.location.reload();
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">All Issues</h1>
        <p className="text-slate-600">
          View and support student issues
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value as IssueCategory | 'All')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'newest' | 'most-agreed')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="most-agreed">Most Agreed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No issues found in this category</p>
          </div>
        ) : (
          <>
            <IssueGrid
              issues={paginatedIssues}
              agreedIssueIds={agreedIssueIds}
              onAgree={handleAgree}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2 flex-wrap justify-center">
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
