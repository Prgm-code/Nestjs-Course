import * as mongoose from 'mongoose';

export const UserScherma = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },

    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

UserScherma.index({ username: 1 }, { unique: true });
UserScherma.index({ email: 1 }, { unique: true });
