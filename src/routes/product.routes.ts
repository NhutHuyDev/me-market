import ProductControllers from '@src/controllers/product.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { SystemRoles } from '@src/models/role.model'
import { ProductSchema, PublishProductSchema } from '@src/schema/product.request.schemas'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([SystemRoles.Seller])))
router.post('/', ValidateResource(ProductSchema), HandleException(ProductControllers.CreateHandler))

router.patch(
  '/',
  ValidateResource(ProductSchema),
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

export default router
