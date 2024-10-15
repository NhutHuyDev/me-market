const DEFAULT_CONFIG = {
  DEV: {
    PORT: 8080,
    ACCESS_TOKEN_EXPIRATION: '1 days',
    REFESH_TOKEN_EXPIRATION: '90 days',
    DB: {
      MONGO: {
        CONNECTION_STR:
          'mongodb://root:example@127.0.0.1:27017/ecommerce_express_dev?authSource=admin'
      }
    }
  },

  PRO: {
    PORT: 5000,
    ACCESS_TOKEN_EXPIRATION: '1 days',
    REFESH_TOKEN_EXPIRATION: '90 days',
    DB: {
      MONGO: {
        CONNECTION_STR: 'mongodb://root:example@mongo:27017/ecommerce_express_dev?authSource=admin'
      }
    }
  }
}

export default DEFAULT_CONFIG
