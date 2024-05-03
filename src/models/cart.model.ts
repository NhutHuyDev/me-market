import { Schema, model } from 'mongoose'

export enum CartState {
  Active = 'Active',
  Inactive = 'Inactive'
}

export interface ICart {
  CartState: string
  Buyer: Schema.Types.ObjectId
  CountProduct: number
  Products: [
    {
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
    CountProduct: {
      type: Number,
      default: 0
    },
    Products: [
      {
        Product: { type: Schema.Types.ObjectId, ref: 'Products' },
        Seller: { type: Schema.Types.ObjectId, ref: 'Users' },
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
