import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
  createdBy: string; // userId of the admin who created it
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

// Default categories seeded when the collection is empty
export const DEFAULT_CATEGORIES = [
  'Infrastructure',
  'Cleanliness',
  'Technology',
  'Safety',
  'Cafeteria',
  'Others',
];

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
