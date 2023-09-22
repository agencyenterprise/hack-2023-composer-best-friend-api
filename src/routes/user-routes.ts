import { Router } from 'express';

import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

import {
  create as createUser,
  updateKey,
} from '../controllers/user-controller';

export const router = Router()

router.post('/',async (req, res) => {
  await createUser(req.body)
  return res.status(200).send()
})


router.post('/key', ClerkExpressRequireAuth({}), async (req, res) => {
  await updateKey(req.auth.userId, req.body.key)
  return res.status(200).send()
})