import { CreatedResponse, OkResponse } from '@src/core/success.responses'
import { TRequestVerifyOtpSchema } from '@src/schema/user.request.schemas'
import UserServices from '@src/services/user.services'
import { Request, Response } from 'express'

class UserControllers {
  static RequestVerifyOtpHandler = async function (
    req: Request<object, object, TRequestVerifyOtpSchema>,
    res: Response
  ) {
    new OkResponse(await UserServices.RequestVerifyOtp(req.body.email)).send(res)
  }
}

export default UserControllers
