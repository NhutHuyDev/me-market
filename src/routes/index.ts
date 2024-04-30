import express, { Request, Response, NextFunction } from 'express'
import UserRoutes from './user.routes'
import AccessRoutes from './access.routes'
import CredentialRoutes from './credential.routes'

import SellerRoutes from './seller.routes'
import ProductRoutes from './product.routes'
import DiscountRoutes from './discount.routes'

import { NotFoundError } from '@src/core/exceptions'
import handleException from '@src/helpers/handleException'
import DeserializeUser from '../middlewares/deserializeUser'

const router = express.Router()

router.get('/v1/api/health-check', (_, res) => {
  return res.sendStatus(200)
})

router.use(handleException(DeserializeUser))

/**
 * @description auth feature routes
 */

router.use('/v1/api/users', UserRoutes)
router.use('/v1/api/access', AccessRoutes)
router.use('/v1/api/credential', CredentialRoutes)

/**
 * @description seller feature routes
 */
router.use('/v1/api/seller', SellerRoutes)
router.use('/v1/api/products', ProductRoutes)
router.use('/v1/api/discounts', DiscountRoutes)

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
  console.log(error)
  console.log(error.stack)
  const status = error.code >= 400 && error.code < 500 ? 'error' : 'fail'
  const code = error.code >= 400 && error.code < 500 ? error.code : 500
  return res.status(code).json({
    code: code,
    status: status,
    message: error.message || 'Internal server error'
  })
})

export default router
