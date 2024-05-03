import { BadRequestResponse } from '@src/core/error.responses'
import { InternalServerError } from '@src/core/exceptions'
import { OkResponse } from '@src/core/success.responses'
import CartModel from '@src/models/cart.model'
import ProductModel from '@src/models/product.model'
import CartRepo from '@src/models/repositories/cart.repo'

class CartServices {
  static FindCart = async function (buyerId: string) {
    const cart = await CartModel.findOne({
      Buyer: buyerId
    })
      .populate('Products.Product')
      .populate('Products.Seller')

    return new OkResponse({
      cart: cart
    })
  }

  static AddToCart = async function (buyerId: string, productId: string, quantity: number) {
    const product = await ProductModel.findById(productId)

    if (!product) {
      return new BadRequestResponse('product is not found')
    }

    let cart = null

    if (await CartRepo.IsProductInCart(buyerId, productId)) {
      cart = await CartModel.findOneAndUpdate(
        {
          Buyer: buyerId,
          'Products.Product': productId
        },
        {
          $inc: {
            'Products.$.Quantity': quantity
          }
        },
        { new: true }
      )
    } else {
      cart = await CartModel.findOneAndUpdate(
        {
          Buyer: buyerId
        },
        {
          $push: {
            Products: {
              Product: productId,
              Seller: product.Seller,
              Quantity: quantity
            }
          }
        },
        { new: true }
      )
    }

    return new OkResponse({
      cart: cart
    })
  }

  static UpdateProductQuantity = async function (
    buyerId: string,
    productId: string,
    newQuantity: number
  ) {
    const cart = await CartModel.findOneAndUpdate(
      {
        Buyer: buyerId,
        'Products.Product': productId
      },
      {
        $inc: {
          'Products.$.Quantity': newQuantity
        }
      },
      { new: true }
    )

    if (cart) {
      return new OkResponse({
        cart: cart
      })
    } else {
      return new BadRequestResponse('cannot update product quantity')
    }
  }

  static RemoveProducts = async function (productIds: string[]) {}
}

export default CartServices
