import { OkResponse } from '@src/core/success.responses'
import {
  TRequestResetPasswordSchema,
  TResetPasswordSchema
} from '@src/schema/credential.request.schemas'
import CredentialServices from '@src/services/credential.services'
import { Request, Response } from 'express'

class CredentialControllers {
  static RequestResetPasswordHandler = async function (
    req: Request<object, object, TRequestResetPasswordSchema>,
    res: Response
  ) {
    const email = req.body.email
    const response = await CredentialServices.RequestResetPassword(email)
    response.Send(res)
  }

  static ResetPasswordHandler = async function (
    req: Request<TResetPasswordSchema['params'], object, TResetPasswordSchema['body']>,
    res: Response
  ) {
    const userId = req.params.userId
    const passwordResetCode = req.params.passwordResetCode
    const newPassword = req.body.newPassword
    const response = await CredentialServices.ResetPassword(userId, newPassword, passwordResetCode)
    response.Send(res)
  }
}

export default CredentialControllers
