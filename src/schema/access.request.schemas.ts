import { TypeOf, object, string } from 'zod'

export const SignInSchema = object({
  body: object({
    credLogin: string({
      required_error: 'Email is required'
    }).email('Invalid email or password'),
    credPassword: string({
      required_error: 'Password is required'
    }).min(8, 'Password must be minimum eight characters')
  })
})

export type TSignInSchema = TypeOf<typeof SignInSchema>['body']
