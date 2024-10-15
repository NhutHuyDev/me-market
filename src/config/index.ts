import DEFAULT_CONFIG from './default'
import * as dotenv from 'dotenv'

dotenv.config()

const dev = {
  app: {
    port: Number(process.env.DEV_PORT) || DEFAULT_CONFIG.DEV.PORT,
    access_token_expiration:
      process.env.ACCESS_TOKEN_EXPIRATION || DEFAULT_CONFIG.DEV.ACCESS_TOKEN_EXPIRATION,
    refresh_token_expiration:
      process.env.REFESH_TOKEN_EXPIRATION || DEFAULT_CONFIG.DEV.REFESH_TOKEN_EXPIRATION
  },
  db: {
    mongo: {
      connection_str: process.env.MONGO_CONNECTION_STR || DEFAULT_CONFIG.DEV.DB.MONGO.CONNECTION_STR
    }
  },
  smtp: {
    user: process.env.ADMIN_EMAIL_ADDRESS,
    clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
    clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    firstName: process.env.SUPER_ADMIN_FIRST_NAME,
    lastName: process.env.SUPER_ADMIN_LAST_NAME,
    mobilePhone: process.env.SUPER_ADMIN_MOBILE_PHONE,
    credPassword: process.env.SUPER_ADMIN_CRED_PASSWORD
  }
}

const pro = {
  app: {
    port: Number(process.env.PRO_PORT) || DEFAULT_CONFIG.PRO.PORT,
    access_token_expiration:
      process.env.ACCESS_TOKEN_EXPIRATION || DEFAULT_CONFIG.DEV.ACCESS_TOKEN_EXPIRATION,
    refresh_token_expiration:
      process.env.REFESH_TOKEN_EXPIRATION || DEFAULT_CONFIG.DEV.REFESH_TOKEN_EXPIRATION
  },
  db: {
    mongo: {
      connection_str: process.env.MONGO_CONNECTION_STR || DEFAULT_CONFIG.DEV.DB.MONGO.CONNECTION_STR
    }
  },
  smtp: {
    user: process.env.ADMIN_EMAIL_ADDRESS,
    clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
    clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_MAILER_REFRESH_TOKEN
  },
  super_admin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    firstName: process.env.SUPER_ADMIN_FIRST_NAME,
    lastName: process.env.SUPER_ADMIN_LAST_NAME,
    mobilePhone: process.env.SUPER_ADMIN_MOBILE_PHONE,
    credPassword: process.env.SUPER_ADMIN_CRED_PASSWORD
  }
}

const env = process.env.NODE_ENV || 'dev'

const config = env === 'dev' ? dev : pro

export default config
