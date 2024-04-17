import DEFAULT_CONFIG from './default'
import dotenv from 'dotenv'

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
    user: process.env.DEV_SMTP_USER || DEFAULT_CONFIG.DEV.SMTP.USER,
    pass: process.env.DEV_SMTP_PASS || DEFAULT_CONFIG.DEV.SMTP.PASS,
    host: process.env.DEV_SMTP_HOST || DEFAULT_CONFIG.DEV.SMTP.HOST,
    port: Number(process.env.DEV_SMTP_PORT) || DEFAULT_CONFIG.DEV.SMTP.PORT,
    secure: Boolean(process.env.DEV_SMTP_SECURE) || DEFAULT_CONFIG.DEV.SMTP.SECURE
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
    user: process.env.DEV_SMTP_USER || DEFAULT_CONFIG.DEV.SMTP.USER,
    pass: process.env.DEV_SMTP_PASS || DEFAULT_CONFIG.DEV.SMTP.PASS,
    host: process.env.DEV_SMTP_HOST || DEFAULT_CONFIG.DEV.SMTP.HOST,
    port: Number(process.env.DEV_SMTP_PORT) || DEFAULT_CONFIG.DEV.SMTP.PORT,
    secure: Boolean(process.env.DEV_SMTP_SECURE) || DEFAULT_CONFIG.DEV.SMTP.SECURE
  }
}

const env = process.env.NODE_ENV || 'dev'

const config = env === 'dev' ? dev : pro

export default config
