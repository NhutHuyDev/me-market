import { Request, Response, NextFunction } from 'express'
import { IUser } from '@src/models/user.model'
import { ForbiddenResponse } from '@src/core/error.responses'
import { SystemRoles } from '@src/models/role.model'
import { IsSub } from '@src/utils/collection.utils'

const RequireRoles =
  (roles: SystemRoles[]) => async (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as IUser

    if (!user || !IsSub(roles, user.Roles)) {
      return new ForbiddenResponse().Send(res)
    }

    return next()
  }

export default RequireRoles
