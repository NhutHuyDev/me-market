import { Request, Response, NextFunction } from 'express'
import { IUser } from '@src/models/user.model'
import { ForbiddenResponse } from '@src/core/error.responses'

const requireUser = async (_: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user as IUser

  if (!user) {
    throw new ForbiddenResponse()
  }

  return next()
}

export default requireUser
