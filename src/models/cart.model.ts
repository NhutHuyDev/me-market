import { Schema, model } from 'mongoose'

export enum CartState {
  Active = 'Active',
  Inactive = 'Inactive'
}

export type ICart = {
  CartState: string
  Buyer: Schema.Types.ObjectId
  Products: [
    {
      Seller: Schema.Types.ObjectId
      productId: Schema.Types.ObjectId
      quantity: number
    }
  ]
}

const cartSchema = new Schema<ICart>(
  {
    CartState: {
      type: String,
      enum: CartState,
      default: CartState.Active
    },
    Buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    },
    Products: [
      {
        Seller: { type: Schema.Types.ObjectId, ref: 'Users' },
        Product: { type: Schema.Types.ObjectId, ref: 'Products' },
        Quantity: { type: Number }
      }
    ]
  },
  {
    timestamps: true
  }
)

const CartModel = model<ICart>('Carts', cartSchema, 'Carts')

export default CartModel
