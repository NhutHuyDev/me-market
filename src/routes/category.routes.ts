import CategoryControllers from '@src/controllers/category.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import ValidateResource from '@src/middlewares/validateResourse'
import { ESystemRoles } from '@src/models/role.model'
import {
  AddCategorySchema,
  CategoryQuerySchema,
  DeleteCategorySchema,
  GetDetailCategorySchema,
  UpdateCategorySchema
} from '@src/schema/category.request.schemas'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([ESystemRoles.SuperAdmin])))

router.get(
  '/',
  ValidateResource(CategoryQuerySchema),
  HandleException(CategoryControllers.FindHandler)
)

router.get(
  '/:categoryId',
  ValidateResource(GetDetailCategorySchema),
  HandleException(CategoryControllers.GetDetailHandler)
)

router.post(
  '/',
  ValidateResource(AddCategorySchema),
  HandleException(CategoryControllers.CreateHandler)
)

router.patch(
  '/',
  ValidateResource(UpdateCategorySchema),
  HandleException(CategoryControllers.UpdateHandler)
)

router.delete(
  '/',
  ValidateResource(DeleteCategorySchema),
  HandleException(CategoryControllers.DeleteHandler)
)

export default router
