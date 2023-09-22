import { Router } from 'express';

import { create as createUser } from '../controllers/user-controller';

export const router = Router()

router.post('/',async (req, res) => {
  await createUser(req.body)
  return res.status(200).send()
})