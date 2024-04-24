import { TypeOf, object, string } from 'zod'
import IProductStategy from './IProductStategy'
import { OkResponse } from '@src/core/success.responses'
import { TProductSchema } from '@src/schema/product.request.schemas'
import { BadRequestResponse, UnauthorizedResponse } from '@src/core/error.responses'
import ProductModel from '@src/models/product.model'
import { ValidateSchema } from '@src/utils/validateSchema'
import slugify from 'slugify'

export class Clothes implements IProductStategy {
  async Create(input: TProductSchema & TAttributeClothesSchema) {
    const validateResult = ValidateSchema(AttributeClothesSchema, { body: input })

    if (!validateResult.IsValid && validateResult.Message) {
      return new BadRequestResponse(validateResult.Message)
    }

    const ProductAttributes = [
      { code: 'Brand', value: input.ProductAttributes?.Brand, name: 'Brand' },
      { code: 'Size', value: input.ProductAttributes?.Size, name: 'Size' },
      { code: 'Material', value: input.ProductAttributes?.Material, name: 'Material' }
    ]

    const newProduct = await ProductModel.create({
      ...input,
      ProductAttributes: ProductAttributes
    })

    return new OkResponse({
      newProduct: newProduct
    })
  }

  async Update(input: TProductSchema & TAttributeClothesSchema) {
    const validateResult = ValidateSchema(AttributeClothesSchema, { body: input })

    if (!validateResult.IsValid && validateResult.Message) {
      return new BadRequestResponse(validateResult.Message)
    }

    input.ProductSlug = slugify(input.ProductName)

    const ProductAttributes = [
      { code: 'Brand', value: input.ProductAttributes?.Brand, name: 'Brand' },
      { code: 'Size', value: input.ProductAttributes?.Size, name: 'Size' },
      { code: 'Material', value: input.ProductAttributes?.Material, name: 'Material' }
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
      return new OkResponse({
        updatedProduct: updatedProduct
      })
    } else {
      return new UnauthorizedResponse('cannot update the product')
    }
  }
}

const AttributeClothesSchema = object({
  body: object({
    ProductAttributes: object(
      {
        Brand: string({
          required_error: "clothes's brand is required"
        }),
        Size: string({
          required_error: "clothes's size is required"
        }),
        Material: string({
          required_error: "clothes's material is required"
        })
      },
      { required_error: "clothes's attributes are required" }
    )
  })
})

type TAttributeClothesSchema = TypeOf<typeof AttributeClothesSchema>['body']
