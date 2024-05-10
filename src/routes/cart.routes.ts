import CartControllers from '@src/controllers/cart.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { ESystemRoles } from '@src/models/role.model'
import {
  AddToCartSchema,
  RemoveProductsSchema,
  UpdateQuantitySchema
} from '@src/schema/cart.request.schemas'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([ESystemRoles.Buyer])))
router.get('/', HandleException(CartControllers.FindCart))
router.post('/', ValidateResource(AddToCartSchema), HandleException(CartControllers.AddToCart))
router.patch(
  '/',
  ValidateResource(UpdateQuantitySchema),
  HandleException(CartControllers.UpdateQuantity)
)

router.delete(
  '/',
  ValidateResource(RemoveProductsSchema),
  HandleException(CartControllers.RemoveProducts)
)

export default router
