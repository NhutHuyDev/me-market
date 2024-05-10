import ProductControllers from '@src/controllers/product.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { ESystemRoles } from '@src/models/role.model'
import {
  ProductParamsSchema,
  ProductQuerySchema,
  AddProductSchema,
  UpdateProductSchema,
  PublishProductSchema
} from '@src/schema/product.request.schemas'
import express from 'express'

const router = express.Router()

router.get(
  '/:ProductSlug/:ProductId',
  ValidateResource(ProductParamsSchema),
  HandleException(ProductControllers.GetDetailHandler)
)

router.get(
  '/',
  ValidateResource(ProductQuerySchema),
  HandleException(ProductControllers.FilterProductHandler)
)

/**
 * @description product features for sellers
 */

router.use(HandleException(RequireRoles([ESystemRoles.Seller])))
router.post(
  '/',
  ValidateResource(AddProductSchema),
  HandleException(ProductControllers.CreateHandler)
)

router.patch(
  '/',
  ValidateResource(UpdateProductSchema),
  HandleException(ProductControllers.UpdateHandler)
)

router.patch(
  '/publish',
  ValidateResource(PublishProductSchema),
  HandleException(ProductControllers.PublishProductHandler)
)

router.patch(
  '/unpublish',
  ValidateResource(PublishProductSchema),
  HandleException(ProductControllers.UnPublishProductHandler)
)

router.get(
  '/draft',
  ValidateResource(ProductQuerySchema),
  HandleException(ProductControllers.FindDraftHandler)
)

router.get(
  '/publish',
  ValidateResource(ProductQuerySchema),
  HandleException(ProductControllers.FindPublishHandler)
)

router.get(
  '/all',
  ValidateResource(ProductQuerySchema),
  HandleException(ProductControllers.FindAllHandler)
)

router.get(
  '/:ProductId',
  ValidateResource(ProductParamsSchema),
  HandleException(ProductControllers.FindOneHandler)
)

export default router
