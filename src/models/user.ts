import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    clerkUserId: {
      type: String,
      required: true
    },
    usageCount: {
      type: Number,
      default: 0
    }
});