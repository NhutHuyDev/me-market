import AccessControllers from '@src/controllers/access.controllers'
import handleException from '@src/helpers/handleException'
import requireUser from '@src/middlewares/requireUser'
import validateResource from '@src/middlewares/validateResourse'
import { SignInSchema } from '@src/schema/access.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/sign-in',
  validateResource(SignInSchema),
  handleException(AccessControllers.SignInHandler)
)

router.post('/refresh', handleException(AccessControllers.RefreshAccessTokenHandler))

router.use(handleException(requireUser))

router.post('/sign-out', handleException(AccessControllers.SignOutHandler))

export default router
