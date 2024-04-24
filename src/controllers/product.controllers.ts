import { BadRequestResponse } from '@src/core/error.responses'
import { TProductSchema, TPublishProductSchema } from '@src/schema/product.request.schemas'
import ProductServices from '@src/services/product.services'
import { Request, Response } from 'express'

class ProductControllers {
  static CreateHandler = async function (
    req: Request<object, object, TProductSchema>,
    res: Response
  ) {
    const input = req.body

    const User = res.locals.user

    input.Seller = User._id

    const response = await ProductServices.Create(input)
    response.Send(res)
  }

  static UpdateHandler = async function (
    req: Request<object, object, TProductSchema>,
    res: Response
  ) {
    const input = req.body

    const User = res.locals.user

    input.Seller = User._id

    const response = await ProductServices.Update(input)
    response.Send(res)
  }

  static PublishProductHandler = async function (
    req: Request<object, object, TPublishProductSchema>,
    res: Response
  ) {
    const productId = req.body.ProductId

    const User = res.locals.user

    const userId = User._id

    const response = await ProductServices.PublishProduct(productId, userId)
    response.Send(res)
  }

  static UnPublishProductHandler = async function (
    req: Request<object, object, TPublishProductSchema>,
    res: Response
  ) {
    const productId = req.body.ProductId

    const User = res.locals.user

    const userId = User._id

    const response = await ProductServices.UnPublishProduct(productId, userId)
    response.Send(res)
  }
}

export default ProductControllers
