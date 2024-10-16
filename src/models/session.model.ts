import { model, Schema } from 'mongoose'

export type TSession = {
  _id: Schema.Types.ObjectId
  AuthCredential: Schema.Types.ObjectId
  RefreshToken: string | null
  Available: boolean
}

const sessionSchema = new Schema<TSession>({
  AuthCredential: { type: Schema.Types.ObjectId, ref: 'Credentials' },
  RefreshToken: { type: String, default: null },
  Available: { type: Boolean, default: true }
})

const SessionModel = model<TSession>('Sessions', sessionSchema, 'Sessions')

export default SessionModel
