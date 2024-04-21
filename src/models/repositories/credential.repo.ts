import mongoose, { Schema } from 'mongoose'
import CredentialModel from '../credential.model'

class CredentialRepo {
  static FindByCredLogin = async function (credLogin: string) {
    return CredentialModel.findOne({
      CredLogin: credLogin
    })
  }

  static FindByUserId = async function (userId: string) {
    return CredentialModel.findOne({
      User: new mongoose.Types.ObjectId(userId)
    })
  }

  static FindValidRequestResetPassword = async function (userId: string) {
    return CredentialModel.findOne({
      User: new mongoose.Types.ObjectId(userId),
      PasswordResetExpires: { $ne: null, $gt: new Date() }
    })
  }
}

export default CredentialRepo
