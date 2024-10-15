import OtpKeyModel, { EVerifyType } from '../otpKey.model'

class OtpKeyRepo {
  static FindByEmail = (email: string) => {
    return OtpKeyModel.findOne({
      VerifyType: EVerifyType.Email,
      VerifyInfo: email
    })
  }

  static FindValidByEmail = (email: string) => {
    return OtpKeyModel.findOne({
      VerifyType: EVerifyType.Email,
      VerifyInfo: email,
      CurrentOtp: { $ne: null },
      ExpiredAt: { $ne: null, $gt: new Date() }
    })
  }

  static Create = async function (verifyType: EVerifyType, verifyInfo: string) {
    return OtpKeyModel.create({
      VerifyType: verifyType,
      VerifyInfo: verifyInfo
    })
  }

  static IsValidEmail = async (email: string) => {
    const validEmail = await OtpKeyModel.findOne({
      VerifyType: EVerifyType.Email,
      VerifyInfo: email,
      IsVerified: true
    })

    return validEmail ? true : false
  }
}

export default OtpKeyRepo
