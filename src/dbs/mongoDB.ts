import mongoose, { ConnectOptions } from 'mongoose'
const mongoDBConnector = async (connectionStr: string) => {
  if (!connectionStr) {
    console.log('::Mongo Database: missing connection string')
  }

  if (process.env.NODE_ENV !== 'pro') {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
  }

  try {
    await mongoose.connect(connectionStr)
    console.log('::Mongo Database: connected to MongoDB successfully')
  } catch (error) {
    console.log('::Mongo Database: connection to MongoDB failed')
    console.log(error)
  }
}

export default mongoDBConnector
