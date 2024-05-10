import { model, Schema } from 'mongoose'

export enum ESystemRoles {
  SuperAdmin = 'Super Admin',
  Seller = 'Seller',
  Buyer = 'Buyer'
}

export type TRole = {
  _id: Schema.Types.ObjectId
  RoleTitle: ESystemRoles
}

const roleSchema = new Schema<TRole>({
  RoleTitle: {
    type: String,
    enum: Object.values(ESystemRoles),
    unique: true,
    required: true
  }
})

const RoleModel = model<TRole>('Roles', roleSchema, 'Roles')

export default RoleModel
