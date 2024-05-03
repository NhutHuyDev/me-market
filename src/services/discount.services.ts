import { BadRequestResponse, NotFoundResponse } from '@src/core/error.responses'
import { OkResponse } from '@src/core/success.responses'
import DiscountModel, { DiscountAppliedType, DiscountType } from '@src/models/discount.model'
import { TDiscountQuerySchema, TDiscountSchema } from '@src/schema/discount.request.schemas'
import ProductServices from './product.services'
import ProductModel from '@src/models/product.model'

class DiscountServices {
  static Create = async function (input: TDiscountSchema) {
    const existingDiscountCode = await DiscountModel.findOne({
      DiscountCode: input.DiscountCode,
      Seller: input.Seller
    })

    if (existingDiscountCode) {
      return new BadRequestResponse("discount's code is existed")
    }

    const newDiscount = await DiscountModel.create({
      ...input
    })

    return new OkResponse({
      newDiscount: newDiscount
    })
  }

  static Update = async function (input: TDiscountSchema) {
    if (!input.DiscountId) {
      return new BadRequestResponse("discount's id is required")
    }

    const existingDiscountCode = await DiscountModel.findOne({
      DiscountCode: input.DiscountCode,
      Seller: input.Seller
    })

    if (existingDiscountCode && String(existingDiscountCode._id) !== input.DiscountId) {
      return new BadRequestResponse("discount's code is existed")
    }

    const newDiscount = await DiscountModel.findByIdAndUpdate(
      input.DiscountId,
      {
        ...input
      },
      {
        new: true
      }
    )

    if (newDiscount) {
      return new OkResponse({
        newDiscount: newDiscount
      })
    } else {
      return new BadRequestResponse('cannot update the discount')
    }
  }

  static DeleteDiscount = async function (sellerId: string, discountCode: string) {
    const deletedDiscount = await DiscountModel.findOneAndDelete({
      DiscountCode: discountCode,
      Seller: sellerId
    })

    if (deletedDiscount) {
      return new OkResponse({
        deletedDiscount: deletedDiscount
      })
    } else {
      return new BadRequestResponse('cannot delete the discount')
    }
  }

  static FindBySeller = async function (
    sellerId: string,
    queries: TDiscountQuerySchema,
    page: number = 1,
    limit: number = 10
  ) {
    let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }

    if (queries.sort_by) {
      sort =
        queries.sort_by[0] === '-' ? { [queries.sort_by.slice(1)]: -1 } : { [queries.sort_by]: 1 }
    }

    const offset = (page - 1) * limit

    const filterFields: any = {}

    /**
     * @description filter by status - enum {'active', 'inactive'}
     */
    if (queries.status == 'active') {
      filterFields.IsActive = true
    }

    if (queries.status == 'inactive') {
      filterFields.IsActive = false
    }

    /**
     * @description filter by type - enum {'percentage', 'fixed'}
     */
    if (queries.type == DiscountType.Percentage) {
      filterFields.DiscountType = DiscountType.Percentage
    }

    if (queries.type == DiscountType.FixedAmount) {
      filterFields.DiscountType = DiscountType.FixedAmount
    }

    /**
     * @description filter by type - enum {'percentage', 'fixed'}
     */
    if (queries.applied_type == DiscountAppliedType.All) {
      filterFields.AppliedType = DiscountAppliedType.All
    }

    if (queries.applied_type == DiscountAppliedType.Specific) {
      filterFields.AppliedType = DiscountAppliedType.Specific
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

    const numDiscounts = await DiscountModel.countDocuments(
      { Seller: sellerId, ...filters },
      options
    )

    const numPages = Math.ceil(numDiscounts / limit)

    const discounts = await DiscountModel.find({ Seller: sellerId, ...filters }, options)
      .collation({ locale: 'en_US', strength: 2 })
      .sort(sort)
      .skip(offset)
      .limit(limit)

    return new OkResponse({
      numDiscounts: numDiscounts,
      discounts: discounts,
      numPages: numPages,
      previousPage: page - 1 > 0 ? page - 1 : null,
      currentPage: page,
      nextPage: page * 1 + 1 == numPages ? page * 1 + 1 : null
    })
  }

  static GetProductsInDiscount = async function (
    discountCode: string,
    sellerId: string,
    sortBy?: string,
    page: number = 1,
    limit: number = 10
  ) {
    const discount = await DiscountModel.findOne({
      DiscountCode: discountCode,
      Seller: sellerId
    })

    if (!discount) {
      return new BadRequestResponse('cannot get product from the discount')
    }

    if (discount.AppliedType === DiscountAppliedType.All) {
      return await ProductServices.FindAll(sellerId, sortBy, page, limit)
    }

    if (discount.AppliedType === DiscountAppliedType.Specific) {
      let sort: { [key: string]: 1 | -1 } = { createdAt: 1 }

      if (sortBy) {
        sort = sortBy[0] === '-' ? { [sortBy.slice(1)]: -1 } : { [sortBy]: 1 }
      }

      const offset = (page - 1) * limit

      const numProducts = await ProductModel.countDocuments({
        Seller: sellerId,
        _id: { $in: discount.AppliedProducts }
      })

      const numPages = Math.ceil(numProducts / limit)

      const products = await ProductModel.find({
        Seller: sellerId,
        _id: { $in: discount.AppliedProducts }
      })
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
  }

  static ComputeDiscountAmount = async function (discountIds: string[], productIds: string[]) {}
}

export default DiscountServices
