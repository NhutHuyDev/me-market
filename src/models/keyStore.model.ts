import { model, Schema } from 'mongoose'

export interface IKeyStore {
  User: Schema.Types.ObjectId
  PublicKey: string
  PrivateKey: string
}

const sessionSchema = new Schema<IKeyStore>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  PublicKey: { type: String, required: true },
  PrivateKey: { type: String, required: true }
})

const SessionModel = model<IKeyStore>('KeyStore', sessionSchema, 'KeyStore')

export default SessionModel
