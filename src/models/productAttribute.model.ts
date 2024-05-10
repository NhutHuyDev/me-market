import { model, Schema } from 'mongoose'

export type TProductAttribute = {
  _id: Schema.Types.ObjectId
  AttributeTitle: string
}

const productAttributeSchema = new Schema<TProductAttribute>({
  AttributeTitle: {
    type: String,
    required: true
  }
})

const CategoryModel = model<TProductAttribute>(
  'ProductAttributes',
  productAttributeSchema,
  'ProductAttributes'
)

export default CategoryModel
