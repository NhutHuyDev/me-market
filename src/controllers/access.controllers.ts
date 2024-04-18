import { CreatedResponse, OkResponse } from '@src/core/success.responses'
import { TSignInSchema } from '@src/schema/access.request.schemas'
import { TRequestVerifyOtpSchema, TVerifyUserSchema } from '@src/schema/user.request.schemas'
import AccessServices from '@src/services/access.services'
import customHttpHeaders from '@src/utils/customHttpHeaders'
import { Request, Response } from 'express'

class AccessControllers {
  static SignInHandler = async function (
    req: Request<object, object, TSignInSchema>,
    res: Response
  ) {
    const credLogin = req.body.credLogin
    const credPassword = req.body.credPassword
    new OkResponse(await AccessServices.SignIn(credLogin, credPassword)).send(res)
  }

  static SignOutHandler = async function (req: Request, res: Response) {
    const refreshToken = req.headers[customHttpHeaders.REFRESH_TOKEN] as string
    const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

    new OkResponse(await AccessServices.SignOut(refreshToken, clientId)).send(res)
  }
}

export default AccessControllers
