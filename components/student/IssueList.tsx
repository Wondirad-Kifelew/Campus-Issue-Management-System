'use client';

import { Issue } from '@/lib/types';
import { Edit, Trash2, Eye } from 'lucide-react';

interface IssueListProps {
  issues: Issue[];
  onEdit?: (issue: Issue) => void;
  onDelete?: (issueId: string) => void;
  onView?: (issue: Issue) => void;
}

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export function IssueList({ issues, onEdit, onDelete, onView }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No issues found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {issue.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span>Category: {issue.category}</span>
                <span>Submitted: {issue.submittedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[issue.status]
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(issue)}
                  className="p-2 text-slate-600 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this issue?')) {
                      onDelete(issue.id);
                    }
                  }}
                  className="p-2 text-slate-600 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              {onView && (
                <button
                  onClick={() => onView(issue)}
                  className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
