import UserModel from '../user.model'

class UserRepo {
  static FindByEmail = (email: string) => {
    return UserModel.findOne({
      Email: email
    })
  }
}

export default UserRepo
