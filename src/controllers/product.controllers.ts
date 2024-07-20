import { TProduct } from '@src/models/product.model'
import { TUser } from '@src/models/user.model'
import {
  TAddProductSchema,
  TProductParamsSchema,
  TProductQuerySchema,
  TPublishProductSchema,
  TUpdateProductSchema
} from '@src/schema/product.request.schemas'
import ProductServices from '@src/services/product.services'
import { Request, Response } from 'express'

class ProductControllers {
  static CreateHandler = async function (
    req: Request<object, object, TAddProductSchema>,
    res: Response
  ) {
    const User = res.locals.user as TUser

    const productInfo = req.body
    productInfo.seller = String(User._id)

    const response = await ProductServices.Create(productInfo)
    response.Send(res)
  }

  static UpdateHandler = async function (
    req: Request<object, object, TUpdateProductSchema>,
    res: Response
  ) {
    const User = res.locals.user

    const productInfo = req.body
    productInfo.seller = String(User._id)

    const response = await ProductServices.Update(productInfo)
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

  static FindDraftHandler = async function (
    req: Request<object, object, object, TProductQuerySchema>,
    res: Response
  ) {
    const Seller = res.locals.user
    const sellerId = Seller._id

    const sortBy = req.query.sort_by
    const page = req.query.page
    const limit = req.query.limit

    const response = await ProductServices.FindDraft(sellerId, sortBy, page, limit)
    response.Send(res)
  }

  static FindPublishHandler = async function (
    req: Request<object, object, object, TProductQuerySchema>,
    res: Response
  ) {
    const Seller = res.locals.user
    const sellerId = Seller._id

    const sortBy = req.query.sort_by
    const page = req.query.page
    const limit = req.query.limit

    const response = await ProductServices.FindPublish(sellerId, sortBy, page, limit)
    response.Send(res)
  }

  static FindAllHandler = async function (
    req: Request<object, object, object, TProductQuerySchema>,
    res: Response
  ) {
    const Seller = res.locals.user
    const sellerId = Seller._id

    const sortBy = req.query.sort_by
    const page = req.query.page
    const limit = req.query.limit

    const response = await ProductServices.FindAll(sellerId, sortBy, page, limit)
    response.Send(res)
  }

  static FilterProductHandler = async function (
    req: Request<object, object, object, TProductQuerySchema>,
    res: Response
  ) {
    const queries = req.query
    const response = await ProductServices.FindByFilter(queries)
    response.Send(res)
  }

  static FindOneHandler = async function (
    req: Request<TProductParamsSchema, object, object>,
    res: Response
  ) {
    const Seller = res.locals.user
    const sellerId = Seller._id

    const productId = req.params.ProductId

    const response = await ProductServices.FindOne(sellerId, productId)
    response.Send(res)
  }

  static GetDetailHandler = async function (
    req: Request<TProductParamsSchema, object, object>,
    res: Response
  ) {
    const productId = req.params.ProductId
    const productSlug = req.params.ProductSlug || ''

    const response = await ProductServices.GetDetail(productId, productSlug)
    response.Send(res)
  }
}

export default ProductControllers
