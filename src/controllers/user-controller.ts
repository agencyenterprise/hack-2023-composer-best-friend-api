import * as mongoose from 'mongoose';

import { UserSchema } from '../models/user';

const User = mongoose.model('User', UserSchema);

export function create(user: any){
  const newUser = new User(user);
  return newUser.save();
}