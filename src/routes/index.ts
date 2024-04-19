import express, { Request, Response, NextFunction } from 'express'
import UserRoutes from './user.routes'
import AccessRoutes from './access.routes'
import CredentialRoutes from './credential.routes'

import { NotFoundError } from '@src/core/exceptions'
import deserializeUser from '../middlewares/deserializeUser'
import handleException from '@src/helpers/handleException'

const router = express.Router()

router.get('/v1/api/health-check', (_, res) => {
  return res.sendStatus(200)
})

router.use(handleException(deserializeUser))

/**
 * @description main feature routes
 */

router.use('/v1/api/users', UserRoutes)
router.use('/v1/api/access', AccessRoutes)
router.use('/v1/api/credential', CredentialRoutes)

/**
 * @description 404 handling
 */
router.use((req, res, next) => {
  const error = new NotFoundError()
  next(error)
})

/**
 * @description error handling
 */
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error.stack)
  const status = error.code >= 400 && error.code < 500 ? 'error' : 'fail'
  return res.status(error.code || 500).json({
    code: error.code || 500,
    status: status,
    message: error.message || 'Internal server error'
  })
})

export default router
