'use client';

import { useRouter } from 'next/navigation';
import { useAuth, useIssue } from '@/lib/context';
import { IssueForm } from '@/components/student/IssueForm';
import { IssueCategory } from '@/lib/types';

export default function SubmitIssuePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addIssue } = useIssue();

  const handleSubmit = (data: {
    title: string;
    description: string;
    category: IssueCategory;
  }) => {
    addIssue({
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'Pending',
      studentId: user?.id || '',
      studentName: user?.name || 'Anonymous',
      submittedDate: new Date().toISOString().split('T')[0],
    });
    router.push('/student/my-issues');
  };

  const handleCancel = () => {
    router.push('/student');
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit an Issue</h1>
        <p className="text-slate-600">
          Report a campus issue and track its progress
        </p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-8">
        <IssueForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
