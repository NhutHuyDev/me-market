import { model, Schema } from 'mongoose'

export type TKeyStore = {
  _id: Schema.Types.ObjectId
  User: Schema.Types.ObjectId
  PublicKey: string
  PrivateKey: string
}

const keyStoreSchema = new Schema<TKeyStore>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  PublicKey: { type: String, required: true },
  PrivateKey: { type: String, required: true }
})

const KeyStoreModel = model<TKeyStore>('KeyStore', keyStoreSchema, 'KeyStore')

export default KeyStoreModel
