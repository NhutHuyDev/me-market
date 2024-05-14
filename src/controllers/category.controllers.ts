import {
  TAddCategorySchema,
  TCategoryQuerySchema,
  TDeleteCategorySchema,
  TUpdateCategorySchema
} from '@src/schema/category.request.schemas'
import AttributeServices from '@src/services/attribute.services'
import CategoryServices from '@src/services/category.services'
import { Request, Response } from 'express'

class CategoryControllers {
  static FindHandler = async function (
    req: Request<object, object, object, TCategoryQuerySchema>,
    res: Response
  ) {
    const queries = req.query

    const response = await CategoryServices.Find(queries)
    response.Send(res)
  }

  static CreateHandler = async function (
    req: Request<object, object, TAddCategorySchema>,
    res: Response
  ) {
    const input = req.body

    const response = await CategoryServices.Create(input)
    response.Send(res)
  }

  static UpdateHandler = async function (
    req: Request<object, object, TUpdateCategorySchema>,
    res: Response
  ) {
    const input = req.body

    const response = await CategoryServices.Update(input)
    response.Send(res)
  }

  static DeleteHandler = async function (
    req: Request<object, object, TDeleteCategorySchema>,
    res: Response
  ) {
    const input = req.body

    const response = await CategoryServices.Delete(input.categoryId)
    response.Send(res)
  }
}

export default CategoryControllers
