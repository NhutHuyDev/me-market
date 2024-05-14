import { Schema, model } from 'mongoose'
import slugify from 'slugify'

export type TProduct = {
  _id: Schema.Types.ObjectId
  ProductName: string
  ProductSlug: string
  ProductThumb: string
  ProductDescription: string
  ProductPrice: number
  ProductQuantity: number
  Seller: Schema.Types.ObjectId
  ProductCategory: string
  ProductAttributes: [{ AttributeTitle: string; Value: string }]
  ProductAvgRating: number
  IsDraft: boolean
  IsPublished: boolean
}

const productSchema = new Schema<TProduct>(
  {
    ProductName: { type: String, required: true },
    ProductSlug: { type: String },
    ProductThumb: { type: String, default: '/cloud/assets/img/default-product-thumbnail.svg' },
    ProductDescription: { type: String, required: true },
    ProductPrice: { type: Number, required: true },
    Seller: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    ProductCategory: { type: String, ref: 'Categories', required: true },
    ProductAttributes: {
      type: [
        {
          Attribute: { type: String, required: true },
          Value: { type: String, required: true }
        }
      ],
      required: true
    },
    ProductAvgRating: { type: Number, default: 0, max: 5, min: 0 },
    IsDraft: { type: Boolean, default: true },
    IsPublished: { type: Boolean, default: false }
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

productSchema.index({
  ProductName: 'text',
  ProductDescription: 'text'
})

const ProductModel = model<TProduct>('Products', productSchema, 'Products')

export default ProductModel
