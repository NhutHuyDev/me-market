import CredentialModel from '../credential.model'

class CredentialRepo {
  static FindByCredLogin = async function (credLogin: string) {
    return CredentialModel.findOne({
      CredLogin: credLogin
    })
  }
}

export default CredentialRepo
