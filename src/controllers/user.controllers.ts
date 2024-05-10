import {
  TCreateUserSchema,
  TRequestVerifyEmailSchema,
  TVerifyEmailSchema
} from '@src/schema/user.request.schemas'
import UserServices from '@src/services/user.services'
import { Request, Response } from 'express'

class UserControllers {
  static RequestVerifyEmailHandler = async function (
    req: Request<object, object, TRequestVerifyEmailSchema>,
    res: Response
  ) {
    const response = await UserServices.RequestVerifyEmail(req.body.email)
    response.Send(res)
  }

  static VerifyEmailHandler = async function (
    req: Request<object, object, TVerifyEmailSchema>,
    res: Response
  ) {
    const email = req.body.email
    const candidateOtp = req.body.otp

    const response = await UserServices.VerifyEmail(email, candidateOtp)
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
