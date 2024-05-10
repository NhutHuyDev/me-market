import CredentialModel from '../credential.model'

class CredentialRepo {
  static FindByCredLogin = async function (credLogin: string) {
    return CredentialModel.findOne({
      CredLogin: credLogin
    })
  }

  static FindByUserId = async function (userId: string) {
    return CredentialModel.findOne({
      User: userId
    })
  }

  static FindValidRequestResetPassword = async function (userId: string) {
    return CredentialModel.findOne({
      User: userId,
      PasswordResetExpires: { $ne: null, $gt: new Date() }
    })
  }
}

export default CredentialRepo
