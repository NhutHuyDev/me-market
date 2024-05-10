import { model, Schema } from 'mongoose'

export type TCategory = {
  CategoryCode: string
  CategoryTitle: string
  CategoryParent: string | null
  CategoryChildren: string[]
  RequiredAttributes: Schema.Types.ObjectId[]
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
  CategoryParent: {
    type: String,
    ref: 'Categories'
  },
  CategoryChildren: {
    type: [
      {
        type: String,
        ref: 'Categories'
      }
    ],
    default: []
  },
  RequiredAttributes: {
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
