import { Document, Types } from 'mongoose';
export interface ICategoryPercentage extends Document {
  user: Types.ObjectId;
  category: Types.ObjectId;
  threshold: string;
}
