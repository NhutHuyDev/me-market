import RegisterOtpModel from '../registerOtp.model'

class RegisterOtpRepo {
  static FindByEmail = (email: string) => {
    return RegisterOtpModel.findOne({
      Email: email
    })
  }

  static FindValidByEmail = (email: string) => {
    return RegisterOtpModel.findOne({
      Email: email,
      CurrentOtp: { $ne: null },
      ExpiredAt: { $ne: null, $gt: new Date() }
    })
  }

  static Create = async function (email: string) {
    return RegisterOtpModel.create({
      Email: email
    })
  }

  static IsValidEmail = async (email: string) => {
    const validEmail = await RegisterOtpModel.findOne({
      Email: email,
      Verified: true
    })

    return validEmail ? true : false
  }
}

export default RegisterOtpRepo
