import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { BadRequestError } from '@src/core/error.responses'

const validateResource =
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
        const validataError = new BadRequestError(errMsg)
        next(validataError)
      } else {
        next(error)
      }
    }
  }

export default validateResource
