import config from '@src/config'
import CredentialModel from '@src/models/credential.model'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import RoleModel, { ESystemRoles } from '@src/models/role.model'
import UserModel from '@src/models/user.model'

export async function SeedAdmin(): Promise<void> {
  const RoleAdmin = await RoleModel.findOne({
    RoleTitle: [ESystemRoles.SuperAdmin]
  })

  if (!RoleAdmin) {
    throw new Error('there are no admin role in database')
  }

  const newUser = await UserModel.create({
    Email: config.super_admin.email,
    FirstName: config.super_admin.firstName,
    LastName: config.super_admin.lastName,
    MobilePhone: config.super_admin.mobilePhone,
    Roles: [RoleAdmin?._id]
  })

  const authCredential = await CredentialModel.create({
    User: newUser._id,
    CredLogin: config.super_admin.email,
    CredPassword: config.super_admin.credPassword
  })

  await KeyStoreRepo.Create(String(authCredential._id))
}
