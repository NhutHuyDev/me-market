import CredentialControllers from '@src/controllers/credential.controllers'
import HandleException from '@src/helpers/handleException'
import ValidateResource from '@src/middlewares/validateResourse'
import {
  RequestResetPasswordSchema,
  ResetPasswordSchema
} from '@src/schema/credential.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-reset-password',
  ValidateResource(RequestResetPasswordSchema),
  HandleException(CredentialControllers.RequestResetPasswordHandler)
)

router.post(
  '/reset-password/:userId/:passwordResetCode',
  ValidateResource(ResetPasswordSchema),
  HandleException(CredentialControllers.ResetPasswordHandler)
)

export default router
