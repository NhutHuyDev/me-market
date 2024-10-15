import { Schema, model } from 'mongoose'

export enum CartState {
  Active = 'Active',
  Inactive = 'Inactive'
}

export type TCart = {
  _id: Schema.Types.ObjectId
  CartState: string
  Buyer: Schema.Types.ObjectId
  ProductItems: [
    {
      Seller: Schema.Types.ObjectId
      ProductItem: Schema.Types.ObjectId
      Quantity: number
    }
  ]
}

const cartSchema = new Schema<TCart>(
  {
    CartState: {
      type: String,
      enum: CartState,
      default: CartState.Active
    },
    Buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    ProductItems: {
      type: [
        {
          Seller: { type: Schema.Types.ObjectId, ref: 'Users' },
          Product: { type: Schema.Types.ObjectId, ref: 'Products' },
          Quantity: { type: Number }
        }
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
)

const CartModel = model<TCart>('Carts', cartSchema, 'Carts')

export default CartModel
