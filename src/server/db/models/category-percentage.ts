import mongoose, { Schema } from 'mongoose';
import { ICategoryPercentage } from '../interfaces/category-percentage';

const CategoryPercentageSchema: Schema = new Schema<ICategoryPercentage>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    threshold: {
      type: String,
      required: true,
      default: '100',
    },
  },
  {
    timestamps: true,
  }
);

CategoryPercentageSchema.index({ user: 1, category: 1 }, { unique: true });

const CategoryPercentageModel =
  mongoose.models.categoryPercentage ||
  mongoose.model<ICategoryPercentage>(
    'categoryPercentage',
    CategoryPercentageSchema
  );
export default CategoryPercentageModel;
