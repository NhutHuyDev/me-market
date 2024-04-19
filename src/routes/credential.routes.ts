import CredentialControllers from '@src/controllers/credential.controllers'
import handleException from '@src/helpers/handleException'
import validateResource from '@src/middlewares/validateResourse'
import {
  RequestResetPasswordSchema,
  ResetPasswordSchema
} from '@src/schema/credential.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/request-reset-password',
  validateResource(RequestResetPasswordSchema),
  handleException(CredentialControllers.RequestResetPasswordHandler)
)

router.post(
  '/reset-password',
  validateResource(ResetPasswordSchema),
  handleException(CredentialControllers.ResetPasswordHandler)
)

export default router
