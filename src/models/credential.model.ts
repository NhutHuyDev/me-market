import { model, Schema } from 'mongoose'

export interface ICredential {
  User: Schema.Types.ObjectId
  CredLogin: string
  CredPassword: string
  PasswordResetCode?: string
  PasswordResetExpires?: Date
}

const credentialSchema = new Schema<ICredential>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  CredLogin: { type: String, required: true },
  CredPassword: { type: String, required: true },
  PasswordResetCode: { type: String },
  PasswordResetExpires: { type: Date }
})

const CredentialModel = model<ICredential>('Credentials', credentialSchema, 'Credentials')

export default CredentialModel
