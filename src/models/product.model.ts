import { Schema, model } from 'mongoose'
import slugify from 'slugify'

export interface IProduct {
  _id: Schema.Types.ObjectId
  ProductName: string
  ProductSlug: string
  ProductThumb: string
  ProductDescription: string
  ProductPrice: number
  Seller: Schema.Types.ObjectId
  ProductCategory: string
  ProductAttributes: [{ code: string; value: string; name: string }]
  ProductAvgRating: number
  IsDraft: boolean
  IsPublished: boolean
}

const productSchema = new Schema<IProduct>(
  {
    ProductName: { type: String, required: true },
    ProductSlug: { type: String },
    ProductThumb: { type: String, default: '/cloud/assets/img/default-product-thumbnail.svg' },
    ProductDescription: { type: String, required: true },
    ProductPrice: { type: Number, required: true },
    Seller: { type: Schema.Types.ObjectId, ref: 'Users' },
    ProductCategory: { type: String, ref: 'Categories' },
    ProductAttributes: [
      new Schema(
        {
          code: { type: String, required: true },
          value: { type: String, required: true },
          name: { type: String, required: true }
        },
        { _id: false }
      )
    ],
    ProductAvgRating: { type: Number, default: 0, max: 5, min: 0 },
    IsDraft: { type: Boolean, default: true, select: false },
    IsPublished: { type: Boolean, default: false, select: false }
  },
  {
    timestamps: true
  }
)

productSchema.pre('save', function () {
  if (this.isModified('ProductName')) {
    const productSlug = slugify(this.ProductName, { lower: true })
    this.ProductSlug = productSlug
  }
})

const ProductModel = model<IProduct>('Products', productSchema, 'Products')

export default ProductModel
