import { Schema, model } from 'mongoose'

export interface IInventory {
  _id: Schema.Types.ObjectId
  InvenProduct: Schema.Types.ObjectId
  InvenLocation: string
  InvenStock: number
  InvenSeller: Schema.Types.ObjectId
  InvenReservations?: Schema.Types.ObjectId[]
}

const inventorySchema = new Schema<IInventory>(
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
    InvenSeller: {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: true
  }
)

const InventoryModel = model<IInventory>('Inventories', inventorySchema, 'Inventories')

export default InventoryModel
