import { Model, model, Schema } from 'mongoose'
import otpGentertor from 'otp-generator'
import argon2 from 'argon2'

export interface IRegisterOtp {
  Email: string
  CurrentOtp?: string
  ExpiredAt?: Date
  Verified?: boolean
}

interface IRegisterOtpMethods {
  GenerateOtp(): string
}

type RegisterOtpModel = Model<IRegisterOtp, object, IRegisterOtpMethods>

const registerOtpSchema = new Schema<IRegisterOtp, RegisterOtpModel, IRegisterOtpMethods>({
  Email: { type: String, unique: true, required: true },
  CurrentOtp: { type: String },
  ExpiredAt: { type: Date },
  Verified: { type: Boolean }
})
registerOtpSchema.method('GenerateOtp', function GenerateOtp() {
  const expiredTime = Date.now() + 10 * 60 * 1000 // after 10 minutes
  const otpLength = 6

  const newOTP = otpGentertor.generate(otpLength, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  })

  this.CurrentOtp = newOTP
  this.ExpiredAt = new Date(expiredTime)
  this.Verified = false

  return newOTP
})
registerOtpSchema.pre('save', async function () {
  if (!this.CurrentOtp || !this.isModified('CurrentOtp')) {
    return
  }
  const hashOtp = await argon2.hash(this.CurrentOtp)
  this.CurrentOtp = hashOtp
})

const RegisterOtpModel = model<IRegisterOtp, RegisterOtpModel>(
  'RegisterOtp',
  registerOtpSchema,
  'RegisterOtp'
)

export default RegisterOtpModel
