import AccessControllers from '@src/controllers/access.controllers'
import asyncHandler from '@src/helpers/asyncHandler'
import validateResource from '@src/middlewares/validateResourse'
import { SignInSchema } from '@src/schema/access.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/sign-in',
  validateResource(SignInSchema),
  asyncHandler(AccessControllers.SignInHandler)
)

export default router
