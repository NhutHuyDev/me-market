import {
  TComputeDiscountAmount,
  TDiscountQuerySchema,
  TDiscountSchema
} from '@src/schema/discount.request.schemas'
import DiscountServices from '@src/services/discount.services'
import { Request, Response } from 'express'

class DiscountControllers {
  static CreateHandler = async function (
    req: Request<object, object, TDiscountSchema>,
    res: Response
  ) {
    const input = req.body

    const User = res.locals.user

    input.Seller = User._id

    const response = await DiscountServices.Create(input)
    response.Send(res)
  }

  static UpdateHandler = async function (
    req: Request<object, object, TDiscountSchema>,
    res: Response
  ) {
    const input = req.body

    const User = res.locals.user

    input.Seller = User._id

    const response = await DiscountServices.Update(input)
    response.Send(res)
  }

  static FindBySellerHandler = async function (
    req: Request<object, object, object, TDiscountQuerySchema>,
    res: Response
  ) {
    const seller = res.locals.user

    const sellerId = seller._id

    const queries = req.query

    const response = await DiscountServices.FindBySeller(sellerId, queries)
    response.Send(res)
  }

  static ComputeDiscountAmountHandler = async function (
    req: Request<object, object, TComputeDiscountAmount>,
    res: Response
  ) {
    const buyer = res.locals.user

    const buyerId = buyer._id
    const discountId = req.body.discountId
    const products = req.body.products

    const response = await DiscountServices.ComputeDiscountAmount(buyerId, discountId, products)
    response.Send(res)
  }
}

export default DiscountControllers
