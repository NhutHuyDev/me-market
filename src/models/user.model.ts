import { model, Schema } from 'mongoose'

export interface IUser {
  Email: string
  FirstName: string
  LastName: string
  Avatar: string
  About: string
  Verified: boolean
  Roles: [Schema.Types.ObjectId]
}

const userSchema = new Schema<IUser>({
  Email: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Avatar: { type: String, required: true },
  About: { type: String, default: '' },
  Verified: { type: Boolean, default: true },
  Roles: { type: [Schema.Types.ObjectId], ref: 'Roles' }
})

const UserModel = model<IUser>('Users', userSchema, 'Users')

export default UserModel
