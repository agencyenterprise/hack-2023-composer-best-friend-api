import * as mongoose from 'mongoose';

import { UserSchema } from '../models/user';

const User = mongoose.model('User', UserSchema);

export function create(user: any){
  const newUser = new User(user);
  return newUser.save();
}

export async function countUsage(userId: string) {
  let user = await User.findOne({ clerkUserId: userId }).exec();
  if(!user){
    await create({ clerkUserId: userId, usageCount: 1 })
  } else {
    user.usageCount = user.usageCount + 1
    await user.save()
  }
  
}