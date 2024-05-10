import { model, Schema } from 'mongoose'

export type TSession = {
  _id: Schema.Types.ObjectId
  User: Schema.Types.ObjectId
  RefreshToken: string | null
  Available: boolean
}

const sessionSchema = new Schema<TSession>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  RefreshToken: { type: String, default: null },
  Available: { type: Boolean, default: true }
})

const SessionModel = model<TSession>('Sessions', sessionSchema, 'Sessions')

export default SessionModel
