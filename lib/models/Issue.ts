import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IssueCategory, IssueStatus } from '@/lib/types';

export interface IStaffResponse {
  _id?: string;
  staffId: string;
  staffName: string;
  response: string;
  timestamp: string;
}

export interface IIssue extends Document {
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  studentId: string;
  studentName: string;
  submittedDate: string;
  agreementCount: number;
  agreedBy: string[];
  isUrgent: boolean;           // set by PriorityController when agreementCount crosses threshold
  assignedStaffId?: string;    // set by IssueController.assignToStaff()
  responses: IStaffResponse[];
}

const StaffResponseSchema = new Schema<IStaffResponse>({
  staffId:   { type: String, required: true },
  staffName: { type: String, required: true },
  response:  { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
});

const IssueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    submittedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    agreementCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    agreedBy: {
      type: [String],
      default: [],
    },
    isUrgent: {
      type: Boolean,
      default: false,           // PriorityController flips this when count >= URGENCY_THRESHOLD
    },
    assignedStaffId: {
      type: String,
      default: undefined,
    },
    responses: {
      type: [StaffResponseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast category-based queries (staff dashboard filter)
IssueSchema.index({ category: 1, status: 1 });
IssueSchema.index({ studentId: 1 });

const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue;
