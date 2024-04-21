import { BadRequestResponse } from '@src/core/error.responses'
import { OkResponse } from '@src/core/success.responses'
import { SystemRoles } from '@src/models/role.model'
import UserModel from '@src/models/user.model'

class SellerServices {
  static Register = async function (clientID: string) {
    const currentUser = await UserModel.findById(clientID)

    if (!currentUser) {
      return new BadRequestResponse('user does not exist')
    }

    currentUser.Roles.push(SystemRoles.Seller)
    await currentUser.save()

    return new OkResponse({
      message: 'register for selling successfully'
    })
  }
}

export default SellerServices
