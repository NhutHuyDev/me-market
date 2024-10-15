import { BadRequestResponse } from '@src/core/error.responses'
import { OkResponse } from '@src/core/success.responses'
import CategoryModel from '@src/models/category.model'
import ProductAttributeModel from '@src/models/productAttribute.model'
import {
  TAddCategorySchema,
  TCategoryQuerySchema,
  TUpdateCategorySchema
} from '@src/schema/category.request.schemas'

class CategoryServices {
  static Find = async (queries: TCategoryQuerySchema) => {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }
    const { page = 1, limit = 10 } = queries

    if (queries.sort_by) {
      sort =
        queries.sort_by[0] === '-' ? { [queries.sort_by.slice(1)]: -1 } : { [queries.sort_by]: 1 }
    }

    const offset = (page - 1) * limit

    let filters: any = {}
    let options: any = null

    if (queries.search) {
      filters = {
        $text: { $search: queries.search }
      }
      options = { score: { $meta: 'textScore' } }
    }

    const numCategories = await CategoryModel.countDocuments({ ...filters }, options)

    const numPages = Math.ceil(numCategories / limit)

    const categories = await CategoryModel.find({ ...filters }, options)
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numCategories: numCategories,
      categories: categories,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static GetDetail = async (categoryId: string) => {
    const category = await CategoryModel.findById(categoryId).populate([
      {
        path: 'RequiredAttributes'
      },
      {
        path: 'OptionalAttributes'
      }
    ])

    return new OkResponse({
      category: category
    })
  }

  static Create = async (categoryInfo: TAddCategorySchema) => {
    const { categoryCode, categoryTitle, categoryParent, requiredAttributes, optionalAttributes } =
      categoryInfo

    const existedCategory = await CategoryModel.findOne({
      $or: [{ CategoryCode: categoryCode }, { CategoryTitle: categoryTitle }]
    })

    if (existedCategory) {
      return new BadRequestResponse("category's code or category's title exist")
    }

    if (categoryParent) {
      const existedCategoryParent = await CategoryModel.findById(categoryParent)
      if (!existedCategoryParent) {
        return new BadRequestResponse('category parent does not exist')
      }
    }

    for (let index = 0; index < requiredAttributes.length; index++) {
      const attributeId = requiredAttributes[index]
      const existedAttribute = await ProductAttributeModel.findById(attributeId)

      if (!existedAttribute) {
        return new BadRequestResponse('attribute does not exist')
      }
    }

    if (optionalAttributes) {
      for (let index = 0; index < optionalAttributes.length; index++) {
        const attributeId = optionalAttributes[index]
        const existedAttribute = await ProductAttributeModel.findById(attributeId)

        if (!existedAttribute) {
          return new BadRequestResponse('attribute does not exist')
        }
      }
    }

    const newCategory = await CategoryModel.create({
      CategoryCode: categoryCode,
      CategoryTitle: categoryTitle,
      CategoryParent: categoryParent ? categoryParent : null,
      RequiredAttributes: requiredAttributes,
      OptionalAttributes: optionalAttributes ? optionalAttributes : []
    })

    return new OkResponse({
      newCategory: newCategory
    })
  }

  static Update = async (categoryInfo: TUpdateCategorySchema) => {
    const {
      categoryId,
      categoryCode,
      categoryTitle,
      categoryParent,
      requiredAttributes,
      optionalAttributes
    } = categoryInfo

    const existedCategory = await CategoryModel.findOne({
      $or: [{ CategoryCode: categoryCode }, { CategoryTitle: categoryTitle }]
    })

    if (existedCategory && String(existedCategory._id) !== categoryId) {
      return new BadRequestResponse("category's code or category's title exist")
    }

    console.log('categoryParent: ', categoryParent)

    if (categoryParent) {
      const existedCategoryParent = await CategoryModel.findById(categoryParent)
      if (!existedCategoryParent) {
        return new BadRequestResponse('category parent does not exist')
      }
    }

    for (let index = 0; index < requiredAttributes.length; index++) {
      const attributeId = requiredAttributes[index]
      const existedAttribute = await ProductAttributeModel.findById(attributeId)

      if (!existedAttribute) {
        return new BadRequestResponse('attribute does not exist')
      }
    }

    if (optionalAttributes) {
      for (let index = 0; index < optionalAttributes.length; index++) {
        const attributeId = optionalAttributes[index]
        const existedAttribute = await ProductAttributeModel.findById(attributeId)

        if (!existedAttribute) {
          return new BadRequestResponse('attribute does not exist')
        }
      }
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        CategoryCode: categoryCode,
        CategoryTitle: categoryTitle,
        CategoryParent: categoryParent ? categoryParent : null,
        RequiredAttributes: requiredAttributes,
        OptionalAttributes: optionalAttributes ? optionalAttributes : []
      },
      { new: true }
    )

    if (!updatedCategory) {
      return new BadRequestResponse('cannot update the category')
    } else {
      return new OkResponse({
        updatedCategory: updatedCategory
      })
    }
  }

  static Delete = async (categoryId: string) => {
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId)

    if (!deletedCategory) {
      return new BadRequestResponse('cannot delete the category')
    } else {
      return new OkResponse({
        deletedCategory: deletedCategory
      })
    }
  }
}

export default CategoryServices
