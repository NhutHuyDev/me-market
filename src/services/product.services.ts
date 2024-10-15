import CategoryModel from '@src/models/category.model'
import { BadRequestResponse, UnauthorizedResponse } from '@src/core/error.responses'
import {
  TAddProductSchema,
  TUpdateProductSchema,
  TProductQuerySchema
} from '@src/schema/product.request.schemas'
import ProductModel from '@src/models/product.model'
import { OkResponse } from '@src/core/success.responses'
import InventoryModel from '@src/models/inventory.model'

class ProductServices {
  static Create = async function (productInfo: TAddProductSchema) {
    const {
      productName,
      productDescription,
      productThumb,
      productQuantity,
      productPrice,
      productCategory,
      productAttributes,
      seller
    } = productInfo

    const existedCategory = await CategoryModel.findById(productCategory)

    if (!existedCategory) {
      return new BadRequestResponse('category is not supported')
    }

    const validProductAttributes = []
    const productAttributesHash = new Map()
    const requiredAttributes = existedCategory.RequiredAttributes
    const optionalAttributes = existedCategory.OptionalAttributes

    productAttributes.forEach((productAttribute) => {
      productAttributesHash.set(productAttribute.productAttributeId, productAttribute.value)
    })

    /**
     * @description kiểm tra xem có đủ required attributes không ?
     */
    for (let index = 0; index < requiredAttributes.length; index++) {
      const requiredAttribute = String(requiredAttributes[index])
      if (productAttributesHash.has(requiredAttribute)) {
        validProductAttributes.push({
          Attribute: requiredAttribute,
          Value: productAttributesHash.get(requiredAttribute)
        })
      } else {
        return new BadRequestResponse('missing required attributes - ' + String(requiredAttribute))
      }
    }

    /**
     * @description kiểm tra xem có nằm trong optional attributes không ?
     */
    for (let index = 0; index < optionalAttributes.length; index++) {
      const optionalAttribute = String(optionalAttributes[index])
      if (productAttributesHash.has(optionalAttribute)) {
        validProductAttributes.push({
          Attribute: optionalAttribute,
          Value: productAttributesHash.get(optionalAttribute)
        })
      }
    }

    const newProduct = await ProductModel.create({
      ProductName: productName,
      ProductThumb: productThumb,
      ProductDescription: productDescription,
      ProductQuantity: productQuantity,
      ProductPrice: productPrice,
      Seller: seller,
      ProductCategory: productCategory,
      ProductAttributes: validProductAttributes
    })

    const inventory = await InventoryModel.create({
      InvenProduct: newProduct._id,
      Seller: seller,
      InvenStock: productQuantity
    })

    return new OkResponse({
      newProduct: newProduct,
      inventory: inventory
    })
  }

  static Update = async function (productInfo: TUpdateProductSchema) {
    const {
      productId,
      productName,
      productDescription,
      productQuantity,
      productPrice,
      productCategory,
      productAttributes,
      seller
    } = productInfo

    if (!productId) {
      return new BadRequestResponse("product's id is required")
    }

    const currentProduct = await ProductModel.findById(productId)

    if (!currentProduct) {
      return new BadRequestResponse('product is not existed')
    }

    if (String(currentProduct.Seller) !== seller) {
      return new UnauthorizedResponse('cannot update the product')
    }

    const existedCategory = await CategoryModel.findById(productCategory)
    if (!existedCategory) {
      return new BadRequestResponse('category is not supported')
    }

    // const response = await productStrategy.Update(input)

    const validProductAttributes = []
    const productAttributesHash = new Map()
    const requiredAttributes = existedCategory.RequiredAttributes
    const optionalAttributes = existedCategory.OptionalAttributes

    productAttributes.forEach((productAttribute) => {
      productAttributesHash.set(productAttribute.productAttributeId, productAttribute.value)
    })

    /**
     * @description kiểm tra xem có đủ required attributes không ?
     */
    for (let index = 0; index < requiredAttributes.length; index++) {
      const requiredAttribute = String(requiredAttributes[index])
      if (productAttributesHash.has(requiredAttribute)) {
        validProductAttributes.push({
          Attribute: requiredAttribute,
          Value: productAttributesHash.get(requiredAttribute)
        })
      } else {
        return new BadRequestResponse('missing required attributes - ' + String(requiredAttribute))
      }
    }

    /**
     * @description kiểm tra xem có nằm trong optional attributes không ?
     */
    for (let index = 0; index < optionalAttributes.length; index++) {
      const optionalAttribute = String(optionalAttributes[index])
      if (productAttributesHash.has(optionalAttribute)) {
        validProductAttributes.push({
          Attribute: optionalAttribute,
          Value: productAttributesHash.get(optionalAttribute)
        })
      }
    }

    const newProduct = await ProductModel.findByIdAndUpdate(productId, {
      ProductName: productName,
      ProductDescription: productDescription,
      ProductQuantity: productQuantity,
      ProductPrice: productPrice,
      Seller: seller,
      ProductCategory: productCategory,
      ProductAttributes: validProductAttributes
    })

    const inventory = await InventoryModel.findOne(
      {
        InvenProduct: productId,
        Seller: seller
      },
      {
        InvenStock: productQuantity
      }
    )

    return new OkResponse({
      updatedProduct: newProduct,
      inventory: inventory
    })
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

export default ProductServices
