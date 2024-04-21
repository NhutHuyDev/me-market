import {
  TCreateUserSchema,
  TRequestVerifyOtpSchema,
  TVerifyUserSchema
} from '@src/schema/user.request.schemas'
import UserServices from '@src/services/user.services'
import { Request, Response } from 'express'

class UserControllers {
  static RequestVerifyOtpHandler = async function (
    req: Request<object, object, TRequestVerifyOtpSchema>,
    res: Response
  ) {
    const response = await UserServices.RequestVerifyOtp(req.body.email)
    response.Send(res)
  }

  static VerifyUserHandler = async function (
    req: Request<object, object, TVerifyUserSchema>,
    res: Response
  ) {
    const email = req.body.email
    const candidateOtp = req.body.otp

    const response = await UserServices.VerifyUser(email, candidateOtp)
    response.Send(res)
  }

  static CreateUserHandler = async function (
    req: Request<object, object, TCreateUserSchema>,
    res: Response
  ) {
    const input = req.body

    const response = await UserServices.CreateUser(input)
    response.Send(res)
  }
}

export default UserControllers
