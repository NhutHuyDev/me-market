import DiscountControllers from '@src/controllers/discount.controllers'
import ProductControllers from '@src/controllers/product.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { SystemRoles } from '@src/models/role.model'
import { DiscountSchema } from '@src/schema/discount.request.schemas'
import { ProductSchema } from '@src/schema/product.request.schemas'
import express from 'express'

const router = express.Router()

/**
 * @description product features for sellers
 */

router.use(HandleException(RequireRoles([SystemRoles.Seller])))
router.post(
  '/',
  ValidateResource(DiscountSchema),
  HandleException(DiscountControllers.CreateHandler)
)

// router.patch(
//   '/',
//   ValidateResource(ProductSchema),
//   HandleException(ProductControllers.UpdateHandler)
// )

export default router
