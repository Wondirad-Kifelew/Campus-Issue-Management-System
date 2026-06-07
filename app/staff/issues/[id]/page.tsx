'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth, useIssue } from '@/lib/context';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner'; // [INTEGRATED] Toast notifications for feedback

const statusColors = {
  Pending: 'bg-orange-100 text-orange-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Resolved: 'bg-green-100 text-green-700',
};

export default function StaffIssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { issues, updateStatus, addResponse } = useIssue();
  const issueId = params.id as string;    
  const [isLoading, setIsLoading] = useState(true);  // ← add this
  const issue = issues.find((i) => i?.id === issueId);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState(issue?.status || 'Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [INTEGRATED] Sync newStatus when issue updates from API
  useEffect(() => {
    if (issue) {
      setNewStatus(issue.status);
    }
  }, [issue?.status]);

  if (!issue) {
    return (
      <div className="max-w-4xl">
        
        <Link href="/staff/issues" className="text-blue-600 hover:text-blue-700 font-semibold">
        <ArrowLeft className="w-4 h-4" />
          Back to issues
        </Link>
        <div className="bg-white rounded-lg shadow border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Issue not found</p>
        </div>
      </div>
    );
  }

  // [INTEGRATED] Call API to update status
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as 'Pending' | 'In Progress' | 'Resolved';
    setNewStatus(status);
    await updateStatus(issueId, status);
  };

  // [INTEGRATED] Call API to add response with error handling
  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    try {
      window.location.reload(); 
      await addResponse(issueId, user.id, user.name, responseText);
      setResponseText('');
    } catch (error) {
      console.error(' Error adding response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Student Information - Right Column */}
        <div>
          <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Student Information</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Name</p>
                <p className="text-sm font-semibold text-slate-900">{issue.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Student ID</p>
                <p className="text-sm font-semibold text-slate-900">{issue.studentId}</p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    statusColors[issue.status]
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            </div>
          </div>
        </div>  
        
        {/* Issue Details - Left Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border border-slate-200 p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {issue.title}
                </h1>
                <p className="text-slate-600 mb-4">{issue.description}</p>
              </div>
              <select
                value={newStatus}
                onChange={handleStatusChange}
                className={`px-4 py-2 rounded-lg font-semibold text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusColors[newStatus as keyof typeof statusColors]}`}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200 my-4">
              <div>
                <p className="text-sm text-slate-600">Category</p>
                <p className="text-sm font-semibold text-slate-900">{issue.category}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Students Agreed</p>
                <p className="text-sm font-semibold text-slate-900">{issue.agreementCount}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Submitted Date</p>
                <p className="text-sm font-semibold text-slate-900">{issue.submittedDate}</p>
              </div>
            </div>
          </div>

          {/* Responses Section */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Responses</h2>

            {issue.responses && issue.responses.length > 0 ? (
              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                {issue.responses.map((response, key) => (
                  <div key={key} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-slate-900">{response.staffName}</p>
                      <p className="text-xs text-slate-600">
                        {new Date(response.timestamp).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-slate-700">{response.response}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 mb-6">No responses yet</p>
            )}

            {/* Response Form */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type your response to the student
              </label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Enter your response here..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                rows={5}
              />
              <button
                onClick={handleSubmitResponse}
                disabled={isSubmitting || !responseText.trim()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send response'}
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
