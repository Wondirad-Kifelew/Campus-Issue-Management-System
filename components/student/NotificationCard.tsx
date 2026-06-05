'use client';

import { Notification } from '@/lib/types';
import { Eye, ClipboardList, MessageCircle, CheckCircle, Pin } from 'lucide-react';

interface NotificationCardProps {
  notification: Notification;
  onViewReply?: (notification: Notification) => void;
}

export function NotificationCard({
  notification,
  onViewReply,
}: NotificationCardProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_update':
        return <ClipboardList className="w-6 h-6 text-blue-500" />;
      case 'staff_reply':
        return <MessageCircle className="w-6 h-6 text-purple-500" />;
      case 'issue_resolved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Pin className="w-6 h-6 text-slate-500" />;
    }
  };

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'status_update':
        return 'Issue status updated';
      case 'staff_reply':
        return 'Staff replied to your issue';
      case 'issue_resolved':
        return 'Issue has been resolved';
      default:
        return 'Notification';
    }
  };

  return (
    <div
      className={`border rounded-lg p-6 ${
        notification.read
          ? 'bg-white border-slate-200'
          : 'bg-blue-50 border-blue-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">
            {getNotificationTitle(notification.type)}
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Your issue &quot;<strong>{notification.issueTitle}</strong>&quot; is{' '}
            {notification.message}
          </p>
          {notification.staffName && (
            <p className="text-sm text-slate-600 mt-2">
              <strong>{notification.staffName}</strong> replied to your issue
            </p>
          )}
          <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
        </div>

        {notification.type === 'staff_reply' && onViewReply && (
          <button
            onClick={() => onViewReply(notification)}
            className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">View reply</span>
          </button>
        )}
      </div>
    </div>
  );
}