import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '@src/core/error.responses'
import { IUser } from '@src/models/user.model'

const requireUser = async (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user as IUser

  if (!user) {
    throw new ForbiddenError()
  }

  return next()
}

export default requireUser
