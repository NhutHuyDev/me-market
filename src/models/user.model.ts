import { model, Schema } from 'mongoose'

export interface IUser {
  Email: string
  FirstName: string
  LastName: string
  Mobile: string
  Avatar: string
  About: string
  Verified: boolean
  Roles: string[]
}

const userSchema = new Schema<IUser>({
  Email: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Mobile: { type: String, required: true },
  Avatar: { type: String, required: true },
  About: { type: String, default: '' },
  Verified: { type: Boolean, default: true },
  Roles: { type: [String] }
})

const UserModel = model<IUser>('Users', userSchema, 'Users')

export default UserModel
