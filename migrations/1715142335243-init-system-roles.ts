import config from '../src/config'
import mongoDBConnector from '../src/dbs/mongoDB'
import RoleModel, { ESystemRoles } from '../src/models/role.model'

export async function up(): Promise<void> {
  await mongoDBConnector(config.db.mongo.connection_str)

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

export async function down(): Promise<void> {
  await mongoDBConnector(config.db.mongo.connection_str)

  await RoleModel.findOneAndDelete({ RoleTitle: ESystemRoles.Buyer })
  await RoleModel.findOneAndDelete({ RoleTitle: ESystemRoles.Seller })
  await RoleModel.findOneAndDelete({ RoleTitle: ESystemRoles.SuperAdmin })
}
