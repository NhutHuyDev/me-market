import ProductAttributeControllers from '@src/controllers/productAttribute.controller'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { ESystemRoles } from '@src/models/role.model'
import {
  AddAttributeSchema,
  AttributeQuerySchema,
  DeleteAttributeSchema,
  UpdateAttributeSchema
} from '@src/schema/attribute.request.schemas'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([ESystemRoles.SuperAdmin])))

router.get(
  '/',
  ValidateResource(AttributeQuerySchema),
  HandleException(ProductAttributeControllers.FindHandler)
)

router.post(
  '/',
  ValidateResource(AddAttributeSchema),
  HandleException(ProductAttributeControllers.CreateHandler)
)

router.patch(
  '/',
  ValidateResource(UpdateAttributeSchema),
  HandleException(ProductAttributeControllers.UpdateHandler)
)

router.delete(
  '/',
  ValidateResource(DeleteAttributeSchema),
  HandleException(ProductAttributeControllers.DeleteHandler)
)

export default router
