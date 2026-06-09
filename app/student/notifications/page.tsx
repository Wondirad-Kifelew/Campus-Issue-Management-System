'use client';

import { useState } from 'react';
import { useIssue } from '@/lib/context';
import { Notification } from '@/lib/types';
import { NotificationCard } from '@/components/student/NotificationCard';
import { X } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead } = useIssue();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleViewReply = async (notification: Notification) => {
    setSelectedNotification(notification);
    console.log("Viewing reply for notification:", notification);
    await markNotificationAsRead(notification.id);
  };

  const handleClose = () => setSelectedNotification(null);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
        <p className="text-slate-600">Stay updated on your issues</p>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow border border-slate-200">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-600">No notifications yet</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-4">
                <NotificationCard
                  notification={notification}
                  onViewReply={handleViewReply}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedNotification && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl border border-slate-200 p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Reply</h3>
              <button
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 mb-3">

                <strong> &gt;</strong>
              </p>
              <p className="text-sm text-slate-700">
                {selectedNotification.message}
              </p>
              {selectedNotification.staffName && (
                <p className="text-xs text-slate-500 mt-3">
                  From: {selectedNotification.staffName}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}