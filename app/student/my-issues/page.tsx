'use client';

import { useState } from 'react';
import { useAuth, useIssue } from '@/lib/context';
import { Issue } from '@/lib/types';
import { IssueList } from '@/components/student/IssueList';
import { EditIssueModal } from '@/components/student/EditIssueModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner'; // [INTEGRATED] Toast notifications for feedback

const ITEMS_PER_PAGE = 5;

export default function MyIssuesPage() {
  const { user } = useAuth();
  const { issues, deleteIssue, updateIssue } = useIssue();
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const myIssues = issues.filter((issue) => issue.studentId === user?.userId);

  const totalPages = Math.ceil(myIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIssues = myIssues.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (issue: Issue) => {
    setEditingIssue(issue);
  };

  // [INTEGRATED] Call API to update issue
  const handleSaveEdit = async (updates: Partial<Issue>) => {
    if (editingIssue) {
      await updateIssue(editingIssue.id, updates);
      setEditingIssue(null);
    }
  };

  // [INTEGRATED] Call API to delete issue with confirmation
  const handleDelete = async (issueId: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await deleteIssue(issueId);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Issues</h1>
        <p className="text-slate-600">
          Track and manage your submitted issues
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
        {myIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No issues submitted yet</p>
          </div>
        ) : (
          <>
            <IssueList
              issues={paginatedIssues}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
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

      {editingIssue && (
        <EditIssueModal
          issue={editingIssue}
          onSave={handleSaveEdit}
          onCancel={() => setEditingIssue(null)}
        />
      )}
    </div>
  );
}
