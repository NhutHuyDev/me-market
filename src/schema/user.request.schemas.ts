import { TypeOf, object, string } from 'zod'

export const RequestVerifyOtpSchema = object({
  body: object({
    email: string({
      required_error: 'email is required'
    }).email('email is not valid')
  })
})

export const VerifyUserSchema = object({
  body: object({
    email: string({
      required_error: 'email is required'
    }).email('email is not valid'),
    otp: string({
      required_error: 'otp is required'
    }).regex(new RegExp('^[0-9]{1,6}$'), 'otp is not valid')
  })
})

export const CreateUserSchema = object({
  body: object({
    email: string({
      required_error: 'email is required'
    }).email('email is not valid'),

    mobile: string({
      required_error: 'mobile phone is required'
    }).regex(/(0[3|5|7|8|9])+([0-9]{8})\b/g, 'mobile phone must have 10 digits, start with 0'),

    firstName: string({
      required_error: 'first name is required'
    }),

    lastName: string({
      required_error: 'last name is required'
    }),

    credPassword: string({
      required_error: 'password is required'
    }).regex(
      new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\\d])(?=.*?[^\\sa-zA-Z0-9]).{8,}'),
      'password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),

    passwordConfirmation: string({
      required_error: 'password confirmation is required'
    })
  }).refine((data) => data.credPassword === data.passwordConfirmation, {
    message: 'password confirmation do not match',
    path: ['passwordConfirmation']
  })
})

export type TRequestVerifyOtpSchema = TypeOf<typeof RequestVerifyOtpSchema>['body']

export type TVerifyUserSchema = TypeOf<typeof VerifyUserSchema>['body']

export type TCreateUserSchema = TypeOf<typeof CreateUserSchema>['body']
