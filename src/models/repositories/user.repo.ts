import UserModel from '../user.model'

class UserRepo {
  static FindByEmail = async (email: string) => {
    return UserModel.findOne({
      Email: email
    })
  }
}

export default UserRepo
