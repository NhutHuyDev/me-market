const DEFAULT_CONFIG = {
  DEV: {
    PORT: 8080,
    ACCESS_TOKEN_EXPIRATION: '1 days',
    REFESH_TOKEN_EXPIRATION: '90 days',
    DB: {
      MONGO: {
        CONNECTION_STR: ''
      }
    },
    SMTP: {
      USER: 'nguyennhuthuy.dev@gmail.com',
      PASS: 'uxib picj ufdm skxw',
      HOST: 'smtp.gmail.com',
      PORT: 587,
      SECURE: false
    }
  },

  PRO: {
    PORT: 8080,
    ACCESS_TOKEN_EXPIRATION: '1 days',
    REFESH_TOKEN_EXPIRATION: '90 days',
    DB: {
      MONGO: {
        CONNECTION_STR: ''
      }
    },
    SMTP: {
      USER: 'nguyennhuthuy.dev@gmail.com',
      PASS: 'uxib picj ufdm skxw',
      HOST: 'smtp.gmail.com',
      PORT: 587,
      SECURE: false
    }
  }
}

export default DEFAULT_CONFIG
