import RegisterOtpModel from '../registerOtp.model'

class RegisterOtpRepo {
  static FindByEmail = (email: string) => {
    return RegisterOtpModel.findOne({
      Email: email
    })
  }

  static Create = async function (email: string) {
    return RegisterOtpModel.create({
      Email: email
    })
  }
}

export default RegisterOtpRepo
