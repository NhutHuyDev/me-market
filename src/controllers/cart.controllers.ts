import CartServices from '@src/services/cart.services'
import { Request, Response } from 'express'

class CartControllers {
  static FindCart = async function (req: Request, res: Response) {
    const User = res.locals.user

    const buyerId = User._id

    const response = await CartServices.FindCart(buyerId)
    response.Send(res)
  }

  static AddToCart = async function (req: Request, res: Response) {
    const User = res.locals.user

    const buyerId = User._id

    const productId = req.body.productId
    const quantity = req.body.quantity

    const response = await CartServices.AddToCart(buyerId, productId, quantity)
    response.Send(res)
  }

  static UpdateQuantity = async function (req: Request, res: Response) {
    const User = res.locals.user

    const buyerId = User._id

    const productId = req.body.productId
    const quantity = req.body.quantity

    const response = await CartServices.AddToCart(buyerId, productId, quantity)
    response.Send(res)
  }

  static RemoveProducts = async function (req: Request, res: Response) {
    const User = res.locals.user

    const buyerId = User._id

    const productId = req.body.productId
    const quantity = req.body.quantity

    const response = await CartServices.AddToCart(buyerId, productId, quantity)
    response.Send(res)
  }
}

export default CartControllers
