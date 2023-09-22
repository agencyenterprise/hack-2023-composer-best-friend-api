import 'dotenv/config';

import { Router } from 'express';
import fs from 'fs';

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

import {
  countUsage,
  getUserByClerckId,
} from '../controllers/user-controller';

export const router = Router()

router.get('/', ClerkExpressRequireAuth({}), async (req, res) => {
  const { usageCount: countUsageTotal, key } = await getUserByClerckId(req.auth.userId) 
  if(countUsageTotal > 3 && !key){
    return res.status(400).json({ error: 'Usage limit reached' });
  }
  
  const data = await fs.readFileSync('./MIDI_sample.mid');
  // Set the Content-Type header to 'audio/midi'
  res.setHeader('Content-Type', 'audio/midi');

  //TODO If request is ok we then will count usage
  if(true){
    await countUsage(req.auth.userId)
  }
  return res.send(data);
  
})