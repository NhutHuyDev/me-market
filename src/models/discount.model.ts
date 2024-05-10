import { Schema, model } from 'mongoose'

export enum DiscountType {
  Percentage = 'Percentage',
  FixedAmount = 'Fixed Amount'
}

export enum DiscountAppliedType {
  All = 'All',
  Specific = 'Specific'
}

export type TDiscount = {
  _id: Schema.Types.ObjectId
  DiscountCode: string
  DiscountName: string
  DiscountDescription: string
  DiscountType: DiscountType
  DiscountValue: number
  StartDate: Date
  EndDate: Date
  MaxUsage: number | null
  UsedCount: number
  UsedBuyers: Schema.Types.ObjectId[]
  MaxUsagesPerBuyer: number | null
  MinOrderValue: number | null
  Seller: Schema.Types.ObjectId
  AppliedType: DiscountAppliedType
  AppliedProducts: Schema.Types.ObjectId[]
  IsActive: boolean
}

const discountSchema = new Schema<TDiscount>({
  DiscountCode: {
    type: String,
    unique: true,
    required: true
  },
  DiscountName: {
    type: String,
    required: true
  },
  DiscountDescription: {
    type: String,
    required: true
  },
  DiscountType: {
    type: String,
    enum: Object.values(DiscountType),
    required: true
  },
  DiscountValue: {
    type: Number,
    required: true
  },
  StartDate: {
    type: Date,
    required: true
  },
  EndDate: {
    type: Date,
    required: true
  },
  MaxUsage: {
    type: Number,
    default: null
  },
  UsedCount: {
    type: Number,
    default: 0
  },
  UsedBuyers: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users'
      }
    ],
    default: []
  },
  MaxUsagesPerBuyer: {
    type: Number,
    default: null
  },
  MinOrderValue: {
    type: Number,
    default: null
  },
  Seller: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  AppliedType: {
    type: String,
    enum: Object.values(DiscountAppliedType)
  },
  AppliedProducts: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Products'
      }
    ],
    default: []
  },
  IsActive: {
    type: Boolean,
    default: false
  }
})

discountSchema.index({
  DiscountName: 'text',
  DiscountDescription: 'text'
})

const DiscountModel = model<TDiscount>('Discounts', discountSchema, 'Discounts')

export default DiscountModel
