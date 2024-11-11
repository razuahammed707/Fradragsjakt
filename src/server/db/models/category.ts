import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../interfaces/category';

const CategorySchema: Schema = new Schema<ICategory>(
  {
    title: { type: String, required: true, unique: true },
    created_by: {
      type: String,
      enum: ['USER', 'SYSTEM'],
      default: 'USER',
    },
    creator_id: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  },

  { timestamps: true }
);

CategorySchema.index({ title: 1, creator_id: 1 });

const CategoryModel =
  mongoose.models.category ||
  mongoose.model<ICategory>('category', CategorySchema);

export default CategoryModel;
