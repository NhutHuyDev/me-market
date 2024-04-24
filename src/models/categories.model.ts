import { model, Schema } from 'mongoose'

interface ICategory {
  _id: string
  CategoryTitle: string
  CategoryParent: string | null
  CategoryChildren: string[]
}

const categorySchema = new Schema<ICategory>({
  _id: {
    type: String
  },
  CategoryTitle: {
    type: String,
    unique: true,
    required: true
  },
  CategoryParent: {
    type: String,
    ref: 'Categories'
  },
  CategoryChildren: [
    {
      type: String,
      ref: 'Categories',
      default: []
    }
  ]
})

const CategoryModel = model<ICategory>('Categories', categorySchema, 'Categories')

export default CategoryModel
