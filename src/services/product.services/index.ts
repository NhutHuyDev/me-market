import IProductStategy, { TProductStategyResponse } from './product.strategies/IProductStategy'
import { Clothes } from './product.strategies/Clothes'
import { Electronics } from './product.strategies/Electronics'
import { Furnitures } from './product.strategies/Furniture'
import CategoryModel from '@src/models/category.model'
import { BadRequestResponse, UnauthorizedResponse } from '@src/core/error.responses'
import { TProductQuerySchema, TProductSchema } from '@src/schema/product.request.schemas'
import ProductModel from '@src/models/product.model'
import { OkResponse } from '@src/core/success.responses'
import InventoryModel from '@src/models/inventory.model'

class ProductServices {
  static CategoryRegistry: { [key: string]: IProductStategy } = {}

  static RegisterCategory(categoryId: string, strategy: IProductStategy) {
    ProductServices.CategoryRegistry[categoryId] = strategy
  }

  static Create = async function (input: TProductSchema) {
    const category = String(input.ProductCategory)

    const existedCategory = await CategoryModel.findById(category)
    if (!existedCategory) {
      return new BadRequestResponse('category is not supported')
    }

    const productStrategy = ProductServices.CategoryRegistry[category]
    const response: TProductStategyResponse = await productStrategy.Create(input)

    if (response.success && response.product) {
      const inventory = await InventoryModel.create({
        InvenProduct: response.product._id,
        InvenSeller: response.product.Seller,
        InvenStock: input.ProductQuantity
      })

      return new OkResponse({
        newProduct: response.product,
        inventory: inventory
      })
    } else {
      return new BadRequestResponse(response.message)
    }
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
    const response = await productStrategy.Update(input)

    if (response.success && response.product) {
      const inventory = await InventoryModel.create({
        InvenProduct: response.product._id,
        InvenSeller: response.product.Seller,
        InvenStock: input.ProductQuantity
      })

      return new OkResponse({
        newProduct: response.product,
        inventory: inventory
      })
    } else {
      return new BadRequestResponse(response.message)
    }
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

  static FindDraft = async function (
    sellerId: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 20
  ) {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }

    if (sortBy) {
      sort = sortBy[0] === '-' ? { [sortBy.slice(1)]: -1 } : { [sortBy]: 1 }
    }

    const offset = (page - 1) * limit

    const numProducts = await ProductModel.countDocuments({ Seller: sellerId, IsDraft: true })

    const numPages = Math.ceil(numProducts / limit)

    const products = await ProductModel.find({ Seller: sellerId, IsDraft: true })
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numProducts: numProducts,
      products: products,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static FindPublish = async function (
    sellerId: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 10
  ) {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }

    if (sortBy) {
      sort = sortBy[0] === '-' ? { [sortBy.slice(1)]: -1 } : { [sortBy]: 1 }
    }

    const offset = (page - 1) * limit

    const numProducts = await ProductModel.countDocuments({ Seller: sellerId, IsPublished: true })

    const numPages = Math.ceil(numProducts / limit)

    const products = await ProductModel.find({ Seller: sellerId, IsPublished: true })
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numProducts: numProducts,
      products: products,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static FindAll = async function (
    sellerId: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 10
  ) {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }

    if (sortBy) {
      sort = sortBy[0] === '-' ? { [sortBy.slice(1)]: -1 } : { [sortBy]: 1 }
    }

    const offset = (page - 1) * limit

    const numProducts = await ProductModel.countDocuments({ Seller: sellerId })

    const numPages = Math.ceil(numProducts / limit)

    const products = await ProductModel.find({ Seller: sellerId })
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numProducts: numProducts,
      products: products,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static FindByFilter = async function (queries: TProductQuerySchema) {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }
    if (queries.sort_by) {
      sort =
        queries.sort_by[0] === '-' ? { [queries.sort_by.slice(1)]: -1 } : { [queries.sort_by]: 1 }
    }

    const limit = queries.limit || 10
    const page = queries.page || 1

    const offset = (page - 1) * limit

    const filterFields: any = {}

    /**
     * @description filter by categories []
     */
    const categories = queries.categories?.split(',')
    if (categories && categories[0] != '') {
      filterFields.ProductCategory = { $in: categories }
    }

    /**
     * @description filter by status - enum {'draft', 'published'}
     */
    if (queries.status == 'draft') {
      filterFields.IsDraft = true
      filterFields.IsPublished = false
    }

    if (queries.status == 'published') {
      filterFields.IsDraft = false
      filterFields.IsPublished = true
    }

    /**
     * @description filter by price=min,max
     */
    const priceRange = queries.price?.split(',').sort((a: string, b: string) => (a >= b ? 1 : -1))

    if (priceRange && priceRange.length == 2) {
      filterFields.ProductPrice = {
        $gte: priceRange[0] != '' ? priceRange[0] : 0,
        $lte: priceRange[1] != '' ? priceRange[1] : 99999999
      }
    }

    /**
     * @description filter by full text search
     */

    let filters: any = {}
    let options: any = null

    if (queries.search) {
      filters = {
        ...filterFields,
        $text: { $search: queries.search }
      }
      options = { score: { $meta: 'textScore' } }
    } else {
      filters = {
        ...filterFields
      }
    }

    const numProducts = await ProductModel.countDocuments(filters, options)

    const numPages = Math.ceil(numProducts / limit)

    const products = await ProductModel.find(filters, options)
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numProducts: numProducts,
      products: products,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static FindOne = async function (sellerId: string, productId: string) {
    const product = await ProductModel.findOne({
      _id: productId,
      Seller: sellerId
    })

    return new OkResponse({
      product: product
    })
  }

  static GetDetail = async function (productId: string, productSlug: string) {
    const product = await ProductModel.findOne({
      _id: productId,
      ProductSlug: productSlug
    })

    return new OkResponse({
      product: product
    })
  }
}

ProductServices.RegisterCategory('Clothes', new Clothes())
ProductServices.RegisterCategory('Electronics', new Electronics())
ProductServices.RegisterCategory('Furniture', new Furnitures())

export default ProductServices
