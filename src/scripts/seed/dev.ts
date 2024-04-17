import RoleModel, { IRole, SystemRoles } from '@src/models/role.model'

const run = async () => {
  const roles: IRole[] = [
    { RoleName: SystemRoles.SuperAdmin },
    { RoleName: SystemRoles.Shop },
    { RoleName: SystemRoles.Customer }
  ]
  try {
    await RoleModel.insertMany(roles)
  } catch (error) {
    console.log(error)
  }
}

// Auto-run if main script (not imported)
if (require.main === module) {
  run().then(() => {
    console.log('Data seed complete')
    process.exit()
  })
}

export default run
