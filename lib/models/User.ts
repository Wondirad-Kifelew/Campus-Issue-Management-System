import mongoose, { Schema, Document, Model } from 'mongoose';
import type { UserRole, IssueCategory } from '@/lib/types';

export interface IUser extends Document {
  name: string;
  userId: string;         // student/staff ID e.g. NSE/8989/15
  password: string;       // hashed
  role: UserRole;
  staffCategory?: IssueCategory;
  status: 'Active' | 'Deactivated';
  registeredDate: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      required: true,
    },
    staffCategory: {
      type: String,
      enum: ['Infrastructure', 'Cleanliness', 'Technology', 'Safety', 'Cafeteria', 'Others'],
      default: undefined,
    },
    status: {
      type: String,
      enum: ['Active', 'Deactivated'],
      default: 'Active',
    },
    registeredDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;