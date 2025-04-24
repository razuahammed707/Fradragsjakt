import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    profile: { type: [String] },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider === 'credentials';
      },
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    role: {
      type: String,
      enum: ['admin', 'auditor', 'customer'],
      default: 'customer',
    },
    image: {
      type: String,
    },

    questionnaires: {
      children_under_12: { type: Schema.Types.Mixed, default: null },
      occupations: { type: [String], default: [] },
      start_date: { type: String },
      has_travel: { type: Boolean, default: false },
      has_meals: { type: Boolean, default: false },
      has_driving: { type: Boolean, default: false },
      has_workspace: { type: Boolean, default: false },
      has_special_care_children: { type: Boolean, default: false },
      has_parental_allowance: { type: Boolean, default: false },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isStepperSkippedOrCompleted: {
      type: Boolean,
      default: false,
    },
    isSawInstructions: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const User = mongoose.models.user || mongoose.model<IUser>('user', UserSchema);

export default User;
