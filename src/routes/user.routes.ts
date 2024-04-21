import UserControllers from '@src/controllers/user.controllers'
import HandleException from '@src/helpers/handleException'
import ValidateResource from '@src/middlewares/validateResourse'
import {
  CreateUserSchema,
  RequestVerifyOtpSchema,
  VerifyUserSchema
} from '@src/schema/user.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-otp',
  ValidateResource(RequestVerifyOtpSchema),
  HandleException(UserControllers.RequestVerifyOtpHandler)
)

router.post(
  '/verify',
  ValidateResource(VerifyUserSchema),
  HandleException(UserControllers.VerifyUserHandler)
)

router.post(
  '/create',
  ValidateResource(CreateUserSchema),
  HandleException(UserControllers.CreateUserHandler)
)

export default router
