import mongoose, { Schema, Document, Model } from 'mongoose';
import type { NotificationType } from '@/lib/types';

export interface INotification extends Document {
  type: NotificationType;
  issueId: string;
  issueTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipientId: string;    // the student who should see this notification
  staffName?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['status_update', 'staff_reply', 'issue_resolved'],
      required: true,
    },
    issueId: {
      type: String,
      required: true,
    },
    issueTitle: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString(),
    },
    read: {
      type: Boolean,
      default: false,
    },
    recipientId: {
      type: String,
      required: true,   // student's userId — so we only fetch their notifications
    },
    staffName: {
      type: String,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

// Fast lookup by recipient
NotificationSchema.index({ recipientId: 1, read: 1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;