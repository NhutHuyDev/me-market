import { Model, model, Schema } from 'mongoose'
import argon2 from 'argon2'

export interface ICredential {
  User: Schema.Types.ObjectId
  CredLogin: string
  CredPassword: string
  PasswordResetCode?: string | null
  PasswordResetExpires?: Date | null
}

interface ICredentialMethods {
  ValidatePassword(CandidatePassword: string): Promise<string>
}

type TCredentialModel = Model<ICredential, object, ICredentialMethods>

const credentialSchema = new Schema<ICredential, TCredentialModel, ICredentialMethods>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  CredLogin: { type: String, required: true },
  CredPassword: { type: String, required: true },
  PasswordResetCode: { type: String, default: null },
  PasswordResetExpires: { type: Date, default: null }
})

credentialSchema.pre('save', async function () {
  if (!this.isModified('CredPassword')) {
    return
  } else {
    const hashPassword = await argon2.hash(this.CredPassword)
    this.CredPassword = hashPassword
  }

  if (!this.PasswordResetCode || !this.isModified('PasswordResetCode')) {
    return
  } else {
    const hashResetCode = await argon2.hash(this.PasswordResetCode)
    this.PasswordResetCode = hashResetCode
  }
})

credentialSchema.method('ValidatePassword', async function ValidateOtp(CandidatePassword: string) {
  return await argon2.verify(this.CredPassword, CandidatePassword)
})

const CredentialModel = model<ICredential, TCredentialModel>(
  'Credentials',
  credentialSchema,
  'Credentials'
)

export default CredentialModel
