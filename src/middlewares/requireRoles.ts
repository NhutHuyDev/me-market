import { Request, Response, NextFunction } from 'express'
import { TUser } from '@src/models/user.model'
import { ForbiddenResponse } from '@src/core/error.responses'
import RoleModel, { ESystemRoles } from '@src/models/role.model'
import { IsSub } from '@src/utils/collection.utils'

const RequireRoles =
  (roles: ESystemRoles[]) => async (_: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user as TUser

    if (user) {
      const userRoles = (await RoleModel.find({
        _id: { $in: user.Roles }
      })).map(role => role.RoleTitle)
      if (!IsSub(roles, userRoles)) {
        return new ForbiddenResponse().Send(res)
      } else {
        return next()
      }
    } else {
      return next()
    }
  }

export default RequireRoles
