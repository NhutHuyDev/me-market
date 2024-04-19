import UserControllers from '@src/controllers/user.controllers'
import handleException from '@src/helpers/handleException'
import validateResource from '@src/middlewares/validateResourse'
import { CreateUserSchema, RequestVerifyOtpSchema, VerifyUserSchema } from '@src/schema/user.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-otp',
  validateResource(RequestVerifyOtpSchema),
  handleException(UserControllers.RequestVerifyOtpHandler)
)

router.post(
  '/verify',
  validateResource(VerifyUserSchema),
  handleException(UserControllers.VerifyUserHandler)
)

router.post(
  '/create',
  validateResource(CreateUserSchema),
  handleException(UserControllers.CreateUserHandler)
)

export default router
