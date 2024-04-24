import IProductStategy from './product.strategies/IProductStategy'
import { Clothes } from './product.strategies/Clothes'
import { Electronics } from './product.strategies/Electronics'
import { Furnitures } from './product.strategies/Furniture'
import CategoryModel from '@src/models/categories.model'
import { BadRequestResponse, UnauthorizedResponse } from '@src/core/error.responses'
import { TProductSchema } from '@src/schema/product.request.schemas'
import ProductModel from '@src/models/product.model'
import { OkResponse } from '@src/core/success.responses'

class ProductServices {
  static CategoryRegistry: { [key: string]: IProductStategy } = {}

  static registerProductType(categoryId: string, strategy: IProductStategy) {
    ProductServices.CategoryRegistry[categoryId] = strategy
  }

  static Create = async function (input: TProductSchema) {
    const category = String(input.ProductCategory)

    const existedCategory = await CategoryModel.findById(category)
    if (!existedCategory) {
      return new BadRequestResponse('category is not supported')
    }

    const productStrategy = ProductServices.CategoryRegistry[category]
    return await productStrategy.Create(input)
  }

  static Update = async function (input: TProductSchema) {
    if (!input.ProductId) {
      return new BadRequestResponse("product's id is required")
    }

    const category = String(input.ProductCategory)
    const existedCategory = await CategoryModel.findById(category)
    if (!existedCategory) {
      return new BadRequestResponse('category is not supported')
    }

    const productStrategy = ProductServices.CategoryRegistry[category]
    return await productStrategy.Update(input)
  }

  static PublishProduct = async function (productId: string, userId: string) {
    const publishedProduct = await ProductModel.findOneAndUpdate(
      {
        _id: productId,
        Seller: userId
      },
      {
        IsPublished: true,
        IsDraft: false
      },
      { new: true }
    )

    if (publishedProduct) {
      return new OkResponse({
        publishedProduct: publishedProduct
      })
    } else {
      return new UnauthorizedResponse('cannot publish the product')
    }
  }

  static UnPublishProduct = async function (productId: string, userId: string) {
    const publishedProduct = await ProductModel.findOneAndUpdate(
      {
        _id: productId,
        Seller: userId
      },
      {
        IsPublished: false,
        IsDraft: true
      },
      { new: true }
    )

    if (publishedProduct) {
      return new OkResponse({
        publishedProduct: publishedProduct
      })
    } else {
      return new UnauthorizedResponse('cannot publish the product')
    }
  }
}

ProductServices.registerProductType('Clothes', new Clothes())
ProductServices.registerProductType('Electronics', new Electronics())
ProductServices.registerProductType('Furniture', new Furnitures())

export default ProductServices
