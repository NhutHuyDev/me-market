import { model, Schema } from 'mongoose'

export interface ISession {
  User: Schema.Types.ObjectId
  RefreshToken: string
  Available: boolean
}

const sessionSchema = new Schema<ISession>({
  User: { type: Schema.Types.ObjectId, ref: 'Users' },
  RefreshToken: { type: String, required: true },
  Available: { type: Boolean, default: true }
})

const SessionModel = model<ISession>('Sessions', sessionSchema, 'Sessions')

export default SessionModel