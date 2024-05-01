import { TDiscountQuerySchema, TDiscountSchema } from '@src/schema/discount.request.schemas'
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
}

export default DiscountControllers
