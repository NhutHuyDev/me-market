import { InternalServerError } from '@src/core/exceptions'
import { AnyZodObject, ZodError } from 'zod'

export function ValidateSchema(schema: AnyZodObject, parse: unknown) {
  try {
    schema.parse(parse)

    return {
      IsValid: true,
      Message: null
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errors = error.flatten()
      const errMsg = JSON.stringify(errors.fieldErrors)

      return {
        IsValid: false,
        Message: errMsg
      }
    } else {
      throw new InternalServerError('My Custom Error 2')
    }
  }
}
