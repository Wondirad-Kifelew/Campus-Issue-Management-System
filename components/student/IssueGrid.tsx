'use client';

import { Issue } from '@/lib/types';
import { Eye, ThumbsUp, Handshake } from 'lucide-react';

interface IssueGridProps {
  issues: Issue[];
  agreedIssueIds: string[];
  onAgree: (issueId: string) => void;
  onView?: (issue: Issue) => void;
}

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export function IssueGrid({
  issues,
  agreedIssueIds,
  onAgree,
  onView,
}: IssueGridProps) {
  if (issues.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No issues found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {issues.map((issue, key) => (
        <div
          key={key}
          className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
              {issue?.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
              {issue?.description}
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusColors[issue?.status]
                }`}
              >
                {issue?.status}
              </span>
              <span className="text-xs text-slate-600">{issue?.category}</span>
            </div>

            <div className="text-xs text-slate-500">
              Submitted: {issue?.submittedDate}
            </div>
          </div>

          <div className="border-t border-slate-200 mt-4 pt-4 flex items-center justify-between">
            <button
              onClick={() => onAgree(issue?.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                agreedIssueIds.includes(issue?.id)
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Handshake className="w-4 h-4" /> Agree
              <span className="text-sm font-medium">{issue?.agreementCount}</span>
            </button>

            {onView && (
              <button
                onClick={() => onView(issue)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
