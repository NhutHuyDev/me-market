import UserControllers from '@src/controllers/user.controllers'
import HandleException from '@src/helpers/handleException'
import ValidateResource from '@src/middlewares/validateResourse'
import {
  CreateUserSchema,
  RequestVerifyEmailSchema,
  VerifyEmailSchema
} from '@src/schema/user.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-verify-email',
  ValidateResource(RequestVerifyEmailSchema),
  HandleException(UserControllers.RequestVerifyEmailHandler)
)

router.post(
  '/verify-email',
  ValidateResource(VerifyEmailSchema),
  HandleException(UserControllers.VerifyEmailHandler)
)

router.post(
  '/',
  ValidateResource(CreateUserSchema),
  HandleException(UserControllers.CreateUserHandler)
)

export default router
