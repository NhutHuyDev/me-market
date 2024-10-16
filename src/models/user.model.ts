import { model, Schema } from 'mongoose'
import { ESystemRoles } from './role.model'

export type TUser = {
  _id: Schema.Types.ObjectId
  Email: string
  MobilePhone: string
  FirstName: string
  LastName: string
  Avatar: string
  About: string
  IsVerified: boolean
  IsBlocked: boolean
  IsBanned: boolean
  Roles: Array<Schema.Types.ObjectId>
}

const userSchema = new Schema<TUser>({
  Email: { type: String, required: true },
  MobilePhone: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Avatar: { type: String, default: null },
  About: { type: String, default: null },
  IsVerified: { type: Boolean, default: true },
  IsBlocked: { type: Boolean, default: false },
  IsBanned: { type: Boolean, default: false },
  Roles: {
    type: [Schema.Types.ObjectId],
    ref: 'Roles'
  }
})

const UserModel = model<TUser>('Users', userSchema, 'Users')

export default UserModel
