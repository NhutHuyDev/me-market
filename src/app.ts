import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import mongoDBConnector from './dbs/mongoDB'
import config from './config/'
import router from '@src/routes'

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'DELETE'],
    credentials: true
  })
)

/**
 * @description apply rate limiter to all requests
 */
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000 /* 1000 req / 1 minute */,
  max: 1000
})
app.use(limiter)

/**
 * @description third-party middleware
 */
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)

/**
 * @description connect databases
 */
mongoDBConnector(config.db.mongo.connection_str)

/**
 * @description routes
 */
app.use(router)

export default app
