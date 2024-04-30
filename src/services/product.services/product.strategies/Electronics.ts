import { TProductSchema } from '@src/schema/product.request.schemas'
import IProductStategy, { TProductStategyResponse } from './IProductStategy'
import { TypeOf, object, string } from 'zod'
import ProductModel from '@src/models/product.model'
import { ValidateSchema } from '@src/utils/validateSchema'
import slugify from 'slugify'

export class Electronics implements IProductStategy {
  async Create(
    input: TProductSchema & TAttributeElectronicsSchema
  ): Promise<TProductStategyResponse> {
    const validateResult = ValidateSchema(AttributeElectronicsSchema, { body: input })

    if (!validateResult.IsValid && validateResult.Message) {
      return {
        success: false,
        message: validateResult.Message
      }
    }

    const ProductAttributes = [
      { code: 'Manufacturer', value: input.ProductAttributes?.Manufacturer, name: 'Manufacturer' },
      { code: 'Model', value: input.ProductAttributes?.Model, name: 'Model' }
    ]

    const newProduct = await ProductModel.create({
      ...input,
      ProductAttributes: ProductAttributes
    })

    return {
      success: true,
      product: newProduct
    }
  }

  async Update(
    input: TProductSchema & TAttributeElectronicsSchema
  ): Promise<TProductStategyResponse> {
    const validateResult = ValidateSchema(AttributeElectronicsSchema, { body: input })

    if (!validateResult.IsValid && validateResult.Message) {
      return {
        success: false,
        message: validateResult.Message
      }
    }

    input.ProductSlug = slugify(input.ProductName)

    const ProductAttributes = [
      { code: 'Manufacturer', value: input.ProductAttributes?.Manufacturer, name: 'Manufacturer' },
      { code: 'Model', value: input.ProductAttributes?.Model, name: 'Model' }
    ]

    const updatedProduct = await ProductModel.findOneAndUpdate(
      {
        _id: input.ProductId,
        Seller: input.Seller
      },
      {
        ...input,
        ProductAttributes: ProductAttributes
      },
      {
        new: true
      }
    )

    if (updatedProduct) {
      return {
        success: true,
        product: updatedProduct
      }
    } else {
      return {
        success: false,
        message: 'cannot update the product'
      }
    }
  }
}

const AttributeElectronicsSchema = object({
  body: object({
    ProductAttributes: object(
      {
        Manufacturer: string({
          required_error: "electronics's manufacturer is required"
        }),
        Model: string({
          required_error: "electronics's model is required"
        })
      },
      { required_error: "electronics's attributes are required" }
    )
  })
})

type TAttributeElectronicsSchema = TypeOf<typeof AttributeElectronicsSchema>['body']
