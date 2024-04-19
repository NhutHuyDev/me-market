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
    })
      .regex(new RegExp('^[0-9]{1,6}$'), 'otp is not valid')
      .min(6, 'otp is not valid')
  })
})

export const CreateUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email'),

    mobile: string({
      required_error: 'Mobile phone is required'
    }).length(10, 'Mobile phone must have 10 digits'),

    firstName: string({
      required_error: 'First name is required'
    }),

    lastName: string({
      required_error: 'Last name is required'
    }),

    credPassword: string({
      required_error: 'Password is required'
    }).regex(
      new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\\d])(?=.*?[^\\sa-zA-Z0-9]).{8,}'),
      'Password must be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),

    passwordConfirmation: string({
      required_error: 'Password confirmation is required'
    })
  }).refine((data) => data.credPassword === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  })
})

export type TRequestVerifyOtpSchema = TypeOf<typeof RequestVerifyOtpSchema>['body']

export type TVerifyUserSchema = TypeOf<typeof VerifyUserSchema>['body']

export type TCreateUserSchema = TypeOf<typeof CreateUserSchema>['body']
