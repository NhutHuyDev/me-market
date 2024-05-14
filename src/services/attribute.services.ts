import { BadRequestResponse } from '@src/core/error.responses'
import { OkResponse } from '@src/core/success.responses'
import ProductAttributeModel from '@src/models/productAttribute.model'
import { TAttributeQuerySchema } from '@src/schema/attribute.request.schemas'

class AttributeServices {
  static Find = async (queries: TAttributeQuerySchema) => {
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

    const numAttributes = await ProductAttributeModel.countDocuments({ ...filters }, options)

    const numPages = Math.ceil(numAttributes / limit)

    const attributes = await ProductAttributeModel.find({ ...filters }, options)
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numAttributes: numAttributes,
      attributes: attributes,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static Create = async (attributeTitle: string, attributeDescription: string) => {
    const existedAttribute = await ProductAttributeModel.findOne({
      AttributeTitle: attributeTitle
    })

    if (existedAttribute) {
      return new BadRequestResponse("attribute's title is existed")
    }

    const newAttribute = await ProductAttributeModel.create({
      AttributeTitle: attributeTitle,
      AttributeDescription: attributeDescription
    })

    return new OkResponse({
      newAttribute: newAttribute
    })
  }

  static Update = async (
    attributeId: string,
    attributeName: string,
    attributeDescription: string
  ) => {
    const updatedAttribute = await ProductAttributeModel.findByIdAndUpdate(
      attributeId,
      {
        AttributeTitle: attributeName,
        AttributeDescription: attributeDescription
      },
      { new: true }
    )

    if (!updatedAttribute) {
      return new BadRequestResponse('cannot update the attribute')
    }

    return new OkResponse({
      updatedAttribute: updatedAttribute
    })
  }

  static Delete = async (attributeId: string) => {
    const deletedAttribute = await ProductAttributeModel.findByIdAndDelete(attributeId)

    if (!deletedAttribute) {
      return new BadRequestResponse('cannot delete the attribute')
    }

    return new OkResponse({
      deletedAttribute: deletedAttribute
    })
  }
}

export default AttributeServices
