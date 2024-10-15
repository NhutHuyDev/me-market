import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { BadRequestResponse } from '@src/core/error.responses'

const ValidateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.flatten()
        const errMsg = JSON.stringify(errors.fieldErrors)

        const validataError = new BadRequestResponse(errMsg)
        validataError.Send(res)
      } else {
        next(error)
      }
    }
  }

export default ValidateResource
