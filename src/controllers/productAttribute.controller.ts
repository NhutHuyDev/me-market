import {
  TAddAttributeSchema,
  TAttributeQuerySchema,
  TDeleteAttributeSchema,
  TUpdateAttributeSchema
} from '@src/schema/attribute.request.schemas'
import AttributeServices from '@src/services/attribute.services'
import { Request, Response } from 'express'

class ProductAttributeControllers {
  static FindHandler = async function (
    req: Request<object, object, object, TAttributeQuerySchema>,
    res: Response
  ) {
    const queries = req.query

    const response = await AttributeServices.Find(queries)
    response.Send(res)
  }

  static CreateHandler = async function (
    req: Request<object, object, TAddAttributeSchema>,
    res: Response
  ) {
    const input = req.body

    const response = await AttributeServices.Create(
      input.attributeTitle,
      input.attributeDescription
    )
    response.Send(res)
  }

  static UpdateHandler = async function (
    req: Request<object, object, TUpdateAttributeSchema>,
    res: Response
  ) {
    const input = req.body

    const response = await AttributeServices.Update(
      input.attributeId,
      input.attributeTitle,
      input.attributeDescription
    )
    response.Send(res)
  }

  static DeleteHandler = async function (
    req: Request<object, object, TDeleteAttributeSchema>,
    res: Response
  ) {
    const input = req.body

    const response = await AttributeServices.Delete(input.attributeId)
    response.Send(res)
  }
}

export default ProductAttributeControllers
