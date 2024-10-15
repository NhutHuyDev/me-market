import { Model, model, Schema } from 'mongoose'
import argon2 from 'argon2'
import { nanoid } from 'nanoid'

export type TCredential = {
  User: Schema.Types.ObjectId
  CredLogin: string
  CredPassword: string
  PasswordResetCode?: string | null
  PasswordResetExpires?: Date | null
}

type TCredentialMethods = {
  ValidatePassword(CandidatePassword: string): Promise<string>
  GeneratePasswordResetCode(): string
  ValidatePasswordResetCode(CandidatePassword: string): Promise<string>
}

type TCredentialModel = Model<TCredential, object, TCredentialMethods>

const credentialSchema = new Schema<TCredential, TCredentialModel, TCredentialMethods>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  CredLogin: { type: String, required: true, unique: true },
  CredPassword: { type: String, required: true },
  PasswordResetCode: { type: String, default: null },
  PasswordResetExpires: { type: Date, default: null }
})

credentialSchema.pre('save', async function () {
  if (this.isModified('CredPassword')) {
    const hashPassword = await argon2.hash(this.CredPassword)
    this.CredPassword = hashPassword
  }

  if (this.PasswordResetCode && this.isModified('PasswordResetCode')) {
    const hashResetCode = await argon2.hash(this.PasswordResetCode)
    this.PasswordResetCode = hashResetCode
  }
})

credentialSchema.method('GeneratePasswordResetCode', function GeneratePasswordResetCode() {
  const expiredTime = Date.now() + 10 * 60 * 1000 // after 10 minutes
  const newResetCode = nanoid()

  this.PasswordResetCode = newResetCode
  this.PasswordResetExpires = new Date(expiredTime)

  return newResetCode
})

credentialSchema.method('ValidatePassword', async function ValidateOtp(CandidatePassword: string) {
  return await argon2.verify(this.CredPassword, CandidatePassword)
})

credentialSchema.method(
  'ValidatePasswordResetCode',
  async function ValidatePasswordResetCode(candidateCode: string) {
    if (this.PasswordResetCode) {
      return await argon2.verify(this.PasswordResetCode, candidateCode)
    }
    return false
  }
)

const CredentialModel = model<TCredential, TCredentialModel>(
  'Credentials',
  credentialSchema,
  'Credentials'
)

export default CredentialModel
