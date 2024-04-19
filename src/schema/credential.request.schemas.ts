import IsValidObjectId from '@src/utils/checkValidObjectId'
import { TypeOf, object, string } from 'zod'

export const RequestResetPasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Invalid email or password')
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
    password: string({
      required_error: 'Password is required'
    }).min(6, 'Password is too short - should be min 6 chars'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    })
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export type TRequestResetPasswordSchema = TypeOf<typeof RequestResetPasswordSchema>['body']

export type TResetPasswordSchema = TypeOf<typeof ResetPasswordSchema>
