import { model, Schema } from 'mongoose'

export type TCategory = {
  _id: Schema.Types.ObjectId
  CategoryCode: string
  CategoryTitle: string
  RequiredAttributes: Schema.Types.ObjectId[]
  OptionalAttributes: Schema.Types.ObjectId[]
}

const categorySchema = new Schema<TCategory>({
  CategoryCode: {
    type: String,
    unique: true, 
    required: true
  },
  CategoryTitle: {
    type: String,
    required: true
  },
  RequiredAttributes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductAttributes'
      }
    ],
    default: []
  },
  OptionalAttributes: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ProductAttributes'
      }
    ],
    default: []
  }
})

const CategoryModel = model<TCategory>('Categories', categorySchema, 'Categories')

export default CategoryModel
