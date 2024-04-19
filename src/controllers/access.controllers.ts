import { OkResponse } from '@src/core/success.responses'
import { TSignInSchema } from '@src/schema/access.request.schemas'
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

    const response = await AccessServices.SignIn(credLogin, credPassword)
    response.send(res)
  }

  static SignOutHandler = async function (req: Request, res: Response) {
    const refreshToken = req.headers[customHttpHeaders.REFRESH_TOKEN] as string
    const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

    const response = await AccessServices.SignOut(refreshToken, clientId)
    response.send(res)
  }

  static RefreshAccessTokenHandler = async function (req: Request, res: Response) {
    const refreshToken = req.headers[customHttpHeaders.REFRESH_TOKEN] as string
    const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

    const response = await AccessServices.RefreshAccessToken(refreshToken, clientId)
    response.send(res)
  }
}

export default AccessControllers
