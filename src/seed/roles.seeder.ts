import RoleModel, { ESystemRoles } from '@src/models/role.model'

export async function SeedRoles(): Promise<void> {
  await RoleModel.insertMany([
    {
      RoleTitle: ESystemRoles.Buyer
    },
    {
      RoleTitle: ESystemRoles.Seller
    },
    {
      RoleTitle: ESystemRoles.SuperAdmin
    }
  ])
}
