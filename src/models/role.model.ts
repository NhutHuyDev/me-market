import { model, Schema } from 'mongoose'

export enum SystemRoles {
  SuperAdmin = 'Super Admin',
  Shop = 'Shop',
  Customer = 'Customer'
}

export interface IRole {
  RoleName: SystemRoles
}

const roleSchema = new Schema<IRole>({
  RoleName: {
    type: String,
    enum: Object.values(SystemRoles),
    unique: true,
    required: true
  }
})

const RoleModel = model<IRole>('Roles', roleSchema, 'Roles')

export default RoleModel
