import { BadRequestResponse } from '@src/core/error.responses'
import { InternalServerError } from '@src/core/exceptions'
import { OkResponse } from '@src/core/success.responses'
import CartModel from '@src/models/cart.model'
import ProductModel from '@src/models/product.model'
import CartRepo from '@src/models/repositories/cart.repo'
import UserModel from '@src/models/user.model'

class CartServices {
  static FindCart = async function (buyerId: string) {
    const cart = await CartModel.findOne({
      Buyer: buyerId
    })

    if (!cart) {
      return new InternalServerError('cart is missing')
    }

    /*
      ShopOrderIds: [
        {
          seller: {...},
          products: [
            {
              product: {...}
              quantity: number
            },
            ...
          ]
        },
        ...
      ]
    */

    const { Products } = cart

    const shopOrderIds = []

    const sellerSet = new Map()

    let groupNumber = 0

    for (let i = 0; i < Products.length; i++) {
      const current = Products[i]
      const currentSellerId = String(Products[i].Seller)

      const product = await ProductModel.findById(current.Product)

      if (sellerSet.has(currentSellerId)) {
        const groupNumber = sellerSet.get(currentSellerId)
        shopOrderIds[groupNumber].products.push({
          product: product,
          quantity: current.Quantity
        })
      } else {
        sellerSet.set(currentSellerId, groupNumber)
        groupNumber += 1

        const seller = await UserModel.findById(currentSellerId)

        shopOrderIds.push({
          seller: seller,
          products: [
            {
              product: product,
              quantity: current.Quantity
            }
          ]
        })
      }
    }

    return new OkResponse({
      shopOrderIds: shopOrderIds
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
              Seller: product.Seller,
              Product: productId,
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
    quantity: number
  ) {
    const cart = await CartModel.findOneAndUpdate(
      {
        Buyer: buyerId,
        'Products.Product': productId
      },
      {
        'Products.$.Quantity': quantity
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

  static RemoveProducts = async function (buyerId: string, productIds: string[]) {
    const cart = await CartModel.findOneAndUpdate(
      {
        Buyer: buyerId
      },
      {
        $pull: {
          Products: {
            Product: { $in: productIds }
          }
        }
      },
      { new: true }
    )

    if (cart) {
      return new OkResponse({
        cart: cart
      })
    } else {
      return new BadRequestResponse('cannot remove product from the cart')
    }
  }
}

export default CartServices
