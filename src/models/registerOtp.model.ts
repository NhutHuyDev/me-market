import { model, Schema } from 'mongoose'

export interface IKeyStore {
  Email: string
  CurrentOtp?: string
  ExpiredAt?: Date
  Verified?: string
}

const RegisterOtpSchema = new Schema<IKeyStore>({
  Email: { type: String, unique: true, required: true },
  CurrentOtp: { type: String },
  ExpiredAt: { type: Date },
  Verified: { type: String }
})

const RegisterOtpModel = model<IKeyStore>('RegisterOtp', RegisterOtpSchema)

export default RegisterOtpModel
