import mongoDBConnector from '@src/dbs/mongoDB'
import { SeedRoles } from './roles.seeder'
import config from '@src/config'
import { SeedAdmin } from './admin.seeder'

export async function RunSeeds(): Promise<void> {
  await mongoDBConnector(config.db.mongo.connection_str)

  await SeedRoles()
  await SeedAdmin()

  process.exit(0)
}

RunSeeds()
