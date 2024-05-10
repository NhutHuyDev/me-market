import { TypeOf, object, string } from 'zod'
import IProductStategy, { TProductStategyResponse } from './IProductStategy'
import ProductModel, { TProduct } from '@src/models/product.model'
import { ValidateSchema } from '@src/utils/validateSchema'
import slugify from 'slugify'

export class Clothes implements IProductStategy {
  async Create(
    productInfo: Partial<TProduct> & TAttributeClothesSchema
  ): Promise<TProductStategyResponse> {
    const validateResult = ValidateSchema(AttributeClothesSchema, { body: productInfo })

    if (!validateResult.IsValid && validateResult.Message) {
      return {
        success: false,
        message: validateResult.Message
      }
    }

    const ProductAttributes = [
      { code: 'brand', value: productInfo.productAttributes.brand, name: 'Brand' },
      { code: 'size', value: productInfo.productAttributes.size, name: 'Size' },
      { code: 'material', value: productInfo.productAttributes.material, name: 'Material' }
    ]

    const newProduct = await ProductModel.create({
      ...productInfo,
      ProductAttributes: ProductAttributes
    })

    return {
      success: true,
      product: newProduct
    }
  }

  async Update(input: TProductSchema & TAttributeClothesSchema): Promise<TProductStategyResponse> {
    const validateResult = ValidateSchema(AttributeClothesSchema, { body: input })

    if (!validateResult.IsValid && validateResult.Message) {
      return {
        success: false,
        message: validateResult.Message
      }
    }

    input.ProductSlug = slugify(input.ProductName)

    const ProductAttributes = [
      { code: 'brand', value: input.ProductAttributes.Brand, name: 'brand' },
      { code: 'size', value: input.ProductAttributes.Size, name: 'Size' },
      { code: 'material', value: input.ProductAttributes.Material, name: 'Material' }
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

const AttributeClothesSchema = object({
  body: object({
    productAttributes: object(
      {
        brand: string({
          required_error: "clothes's brand is required"
        }),
        size: string({
          required_error: "clothes's size is required"
        }),
        material: string({
          required_error: "clothes's material is required"
        })
      },
      { required_error: "clothes's attributes are required" }
    )
  })
})

type TAttributeClothesSchema = TypeOf<typeof AttributeClothesSchema>['body']
