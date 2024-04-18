import UserControllers from '@src/controllers/user.controllers'
import asyncHandler from '@src/helpers/asyncHandler'
import validateResource from '@src/middlewares/validateResourse'
import { RequestVerifyOtpSchema } from '@src/schema/user.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-otp',
  validateResource(RequestVerifyOtpSchema),
  asyncHandler(UserControllers.RequestVerifyOtpHandler)
)

export default router
