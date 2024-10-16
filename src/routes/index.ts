import express, { Request, Response, NextFunction } from 'express'
import UserRoutes from './user.routes'
import AccessRoutes from './access.routes'
import CredentialRoutes from './credential.routes'

import CartRoutes from './cart.routes'

import SellerRoutes from './seller.routes'
import ProductRoutes from './product.routes'
import DiscountRoutes from './discount.routes'

import ProductAttributeRoutes from './productAttribute.routes'
import CategoryRoutes from './category.routes'

import { NotFoundError } from '@src/core/exceptions'
import handleException from '@src/helpers/handleException'
import DeserializeUser from '../middlewares/deserializeUser'

const router = express.Router()

router.get('/api/v1/health-check', (_, res) => {
  return res.sendStatus(200)
})

router.use(handleException(DeserializeUser))

/**
 * @description auth features
 */

router.use('/api/v1/users', UserRoutes)
router.use('/api/v1/access', AccessRoutes)
router.use('/api/v1/credential', CredentialRoutes)

/**
 * @description cart & order features
 */
router.use('/api/v1/carts', CartRoutes)

/**
 * @description seller features
 */
router.use('/api/v1/sellers', SellerRoutes)
router.use('/api/v1/products', ProductRoutes)
router.use('/api/v1/discounts', DiscountRoutes)

/**
 * @description super admin features
 */
router.use('/api/v1/product-attributes', ProductAttributeRoutes)
router.use('/api/v1/categories', CategoryRoutes)

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
    message: error.message || 'Internal server error'
  })
})

export default router
