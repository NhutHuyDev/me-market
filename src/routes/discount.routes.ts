import DiscountControllers from '@src/controllers/discount.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { SystemRoles } from '@src/models/role.model'
import {
  ComputeDiscountAmount,
  DiscountQuerySchema,
  DiscountSchema
} from '@src/schema/discount.request.schemas'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([SystemRoles.Customer])))
router.post(
  '/amount',
  ValidateResource(ComputeDiscountAmount),
  HandleException(DiscountControllers.ComputeDiscountAmountHandler)
)

/**
 * @description product features for sellers
 */

router.use(HandleException(RequireRoles([SystemRoles.Seller])))
router.post(
  '/',
  ValidateResource(DiscountSchema),
  HandleException(DiscountControllers.CreateHandler)
)

router.patch(
  '/',
  ValidateResource(DiscountSchema),
  HandleException(DiscountControllers.UpdateHandler)
)

router.get(
  '/',
  ValidateResource(DiscountQuerySchema),
  HandleException(DiscountControllers.FindBySellerHandler)
)

export default router
