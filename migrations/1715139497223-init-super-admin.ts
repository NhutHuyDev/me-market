import KeyStoreRepo from '../src/models/repositories/keyStore.repo'
import CredentialModel from '../src/models/credential.model'
import UserModel from '../src/models/user.model'
import config from '../src/config'
import mongoDBConnector from '../src/dbs/mongoDB'
import { ESystemRoles } from '../src/models/role.model'
import KeyStoreModel from '../src/models/keyStore.model'

export async function up(): Promise<void> {
  await mongoDBConnector(config.db.mongo.connection_str)

  const newUser = await UserModel.create({
    Email: config.super_admin.email,
    FirstName: config.super_admin.firstName,
    LastName: config.super_admin.lastName,
    MobilePhone: config.super_admin.mobilePhone,
    Roles: [ESystemRoles.SuperAdmin]
  })

  await KeyStoreRepo.Create(String(newUser._id))

  await CredentialModel.create({
    User: newUser._id,
    CredLogin: config.super_admin.email,
    CredPassword: config.super_admin.credPassword
  })
}

export async function down(): Promise<void> {
  await mongoDBConnector(config.db.mongo.connection_str)

  const deletedUser = await UserModel.findOneAndDelete({
    Email: config.super_admin.email
  })

  await KeyStoreModel.findOneAndDelete({
    User: deletedUser?._id
  })

  await CredentialModel.findOneAndDelete({
    User: deletedUser?._id
  })
}
