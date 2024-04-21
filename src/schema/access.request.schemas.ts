import { TypeOf, object, string } from 'zod'

export const SignInSchema = object({
  body: object({
    credLogin: string({
      required_error: 'email is required'
    }).email('email is not valid'),
    credPassword: string({
      required_error: 'password is required'
    })
  })
})

export type TSignInSchema = TypeOf<typeof SignInSchema>['body']
