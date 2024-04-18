import { CreatedResponse, OkResponse } from '@src/core/success.responses'
import { TRequestVerifyOtpSchema, TVerifyUserSchema } from '@src/schema/user.request.schemas'
import UserServices from '@src/services/user.services'
import { Request, Response } from 'express'

class UserControllers {
  static RequestVerifyOtpHandler = async function (
    req: Request<object, object, TRequestVerifyOtpSchema>,
    res: Response
  ) {
    new OkResponse(await UserServices.RequestVerifyOtp(req.body.email)).send(res)
  }

  static VerifyUserHandler = async function (
    req: Request<object, object, TVerifyUserSchema>,
    res: Response
  ) {
    const email = req.body.email
    const candidateOtp = req.body.otp
    new OkResponse(await UserServices.VerifyUser(email, candidateOtp)).send(res)
  }
}

export default UserControllers
