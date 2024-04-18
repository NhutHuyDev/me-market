import { TypeOf, object, string } from 'zod'

export const RequestVerifyOtpSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Not a valid email')
  })
})

export type TRequestVerifyOtpSchema = TypeOf<typeof RequestVerifyOtpSchema>['body']
