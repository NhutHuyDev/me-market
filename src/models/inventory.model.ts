import { Schema, model } from 'mongoose'

export type TInventory = {
  _id: Schema.Types.ObjectId
  InvenProduct: Schema.Types.ObjectId
  InvenLocation: string
  InvenStock: number
  Seller: Schema.Types.ObjectId
  // InvenReservations?: Schema.Types.ObjectId[]
}

const inventorySchema = new Schema<TInventory>(
  {
    InvenProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Products'
    },
    InvenLocation: {
      type: String,
      default: 'Unknown'
    },
    InvenStock: {
      type: Number,
      required: true
    },
    Seller: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const InventoryModel = model<TInventory>('Inventories', inventorySchema, 'Inventories')

export default InventoryModel
