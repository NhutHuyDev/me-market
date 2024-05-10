import { Model, model, Schema } from 'mongoose'
import otpGentertor from 'otp-generator'
import argon2 from 'argon2'

export enum EVerifyType {
  Email = 'Email',
  MobilePhone = 'Mobile Phone'
}

export type TOtpKey = {
  _id: Schema.Types.ObjectId
  VerifyType: EVerifyType
  VerifyInfo: string
  CurrentOtp: string | null
  ExpiredAt: Date | null
  IsVerified: boolean
}

type TOtpKeyMethods = {
  GenerateOtp(): string
  ValidateOtp(CandidateOtp: string): Promise<string>
}

type TOtpKeyModel = Model<TOtpKey, object, TOtpKeyMethods>

const otpKeySchema = new Schema<TOtpKey, TOtpKeyModel, TOtpKeyMethods>({
  VerifyType: { type: String, enum: Object.values(EVerifyType), required: true },
  VerifyInfo: { type: String, unique: true, required: true },
  CurrentOtp: { type: String, default: null },
  ExpiredAt: { type: Date, default: null },
  IsVerified: { type: Boolean, default: false }
})

/**
 * @description khai báo các method
 */

otpKeySchema.method('GenerateOtp', function GenerateOtp() {
  const expiredTime = Date.now() + 10 * 60 * 1000 // after 10 minutes
  const otpLength = 6

  const newOTP = otpGentertor.generate(otpLength, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false
  })

  this.CurrentOtp = newOTP
  this.ExpiredAt = new Date(expiredTime)
  this.IsVerified = false

  return newOTP
})

otpKeySchema.method('ValidateOtp', async function ValidateOtp(CandidateOtp: string) {
  if (this.CurrentOtp) {
    return await argon2.verify(this.CurrentOtp, CandidateOtp)
  }
})

otpKeySchema.pre('save', async function () {
  if (!this.CurrentOtp || !this.isModified('CurrentOtp')) {
    return
  }
  const hashOtp = await argon2.hash(this.CurrentOtp)
  this.CurrentOtp = hashOtp
})

const OtpKeyModel = model<TOtpKey, TOtpKeyModel>('OtpKeys', otpKeySchema, 'OtpKeys')

export default OtpKeyModel
