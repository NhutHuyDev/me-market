import AccessControllers from '@src/controllers/access.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { ESystemRoles } from '@src/models/role.model'
import { SignInSchema } from '@src/schema/access.request.schemas'
import express from 'express'

const router = express.Router()

router.post(
  '/sign-in',
  ValidateResource(SignInSchema),
  HandleException(AccessControllers.SignInHandler)
)

router.post('/refresh', HandleException(AccessControllers.RefreshAccessTokenHandler))

router.use(HandleException(RequireRoles([ESystemRoles.Buyer])))

router.post('/sign-out', HandleException(AccessControllers.SignOutHandler))

export default router
