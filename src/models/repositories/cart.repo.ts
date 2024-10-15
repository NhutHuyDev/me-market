import CartModel from '../cart.model'

class CartRepo {
  static IsProductInCart = async function (buyerId: string, productId: string) {
    const existingCart = await CartModel.findOne({
      Buyer: buyerId,
      'Products.Product': productId
    })

    if (existingCart) {
      return true
    } else {
      return false
    }
  }
}

export default CartRepo
