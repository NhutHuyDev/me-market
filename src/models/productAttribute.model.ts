import { model, Schema } from 'mongoose'

export type TProductAttribute = {
  _id: Schema.Types.ObjectId
  AttributeTitle: string
  AttributeDescription: string
}

const productAttributeSchema = new Schema<TProductAttribute>({
  AttributeTitle: {
    type: String,
    required: true,
    unique: true
  },
  AttributeDescription: {
    type: String
  }
})

productAttributeSchema.index({
  AttributeTitle: 'text',
  AttributeDescription: 'text'
})

const ProductAttributeModel = model<TProductAttribute>(
  'ProductAttributes',
  productAttributeSchema,
  'ProductAttributes'
)

export default ProductAttributeModel
