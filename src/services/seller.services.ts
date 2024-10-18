import { BadRequestResponse } from '@src/core/error.responses'
import { InternalServerError } from '@src/core/exceptions'
import { OkResponse } from '@src/core/success.responses'
import RoleModel, { ESystemRoles } from '@src/models/role.model'
import UserModel from '@src/models/user.model'

class SellerServices {
  static Register = async function (clientID: string) {
    const currentUser = await UserModel.findById(clientID)

    if (!currentUser) {
      return new BadRequestResponse('user does not exist')
    }

    const sellerRole = await RoleModel.findOne({
      RoleTitle: ESystemRoles.Seller
    })

    if (!sellerRole) {
      return new InternalServerError()
    }

    currentUser.Roles.push(sellerRole._id)
    await currentUser.save()

    return new OkResponse({
      message: 'register for selling successfully'
    })
  }
}

export default SellerServices
