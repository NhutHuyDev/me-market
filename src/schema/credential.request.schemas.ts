import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, object, string } from 'zod'

export const RequestResetPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'email is required'
    }).email('email or password is not valid')
  })
})

export const ResetPasswordSchema = object({
  params: object({
    userId: string({
      required_error: 'user id is required'
    }),
    passwordResetCode: string({
      required_error: 'password reset code is required'
    })
  }).refine((data) => IsValidObjectId(data.userId), {
    message: 'userId is not valid',
    path: ['userId']
  }),

  body: object({
    newPassword: string({
      required_error: 'password is required'
    }).regex(
      new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\\d])(?=.*?[^\\sa-zA-Z0-9]).{8,}'),
      'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    passwordConfirmation: string({
      required_error: 'password confirmation is required'
    })
  }).refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'password confirmation do not match',
    path: ['passwordConfirmation']
  })
})

export type TRequestResetPasswordSchema = TypeOf<typeof RequestResetPasswordSchema>['body']

export type TResetPasswordSchema = TypeOf<typeof ResetPasswordSchema>
