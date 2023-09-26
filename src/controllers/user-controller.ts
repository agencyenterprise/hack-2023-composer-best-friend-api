import * as mongoose from "mongoose";

import { UserSchema } from "../models/user";

const User = mongoose.model("User", UserSchema);

async function createUser(user: any) {
  const newUser = new User(user);
  return newUser.save();
}

export async function create(clerkUserId: string) {
  let user = await User.findOne({ clerkUserId: clerkUserId }).exec();
  if (!user) {
    await createUser({ clerkUserId: clerkUserId, usageCount: 0 });
    return user.save();
  }
  return user;
}

export async function countUsage(userId: string) {
  let user = await User.findOne({ clerkUserId: userId }).exec();
  if (!user) {
    await createUser({ clerkUserId: userId, usageCount: 1 });
  } else {
    user.usageCount = user.usageCount + 1;
    await user.save();
  }
}

export function getUserByClerckId(clerkUserId: string) {
  return User.findOne({ clerkUserId: clerkUserId }).exec();
}

export async function updateKey(userId: string, key: string) {
  const user = await User.findOne({ clerkUserId: userId }).exec();
  user.key = key;
  await user.save();
}
