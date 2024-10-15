import { InternalServerError } from '@src/core/exceptions'
import DiscountModel, { DiscountAppliedType, DiscountType } from '../discount.model'
import ProductModel from '../product.model'

class DiscountRepo {
  static ComputeDiscountAmount = async function (
    buyerId: string,
    discountId: string,
    products: {
      productId: string
      quantity: number
    }[]
  ): Promise<{ Success: boolean; DiscountAmount?: number; Message?: string }> {
    const discount = await DiscountModel.findById(discountId)

    if (!discount) {
      throw new InternalServerError('discount is missing')
    }

    const { IsActive, EndDate, UsedCount, MaxUsage, UsedBuyers, MaxUsagesPerBuyer, MinOrderValue } =
      discount

    if (!IsActive) {
      return {
        Success: false,
        Message: 'the discount is not supported'
      }
    }

    if (EndDate <= new Date()) {
      return {
        Success: false,
        Message: 'the discount is expired'
      }
    }

    if (MaxUsage && MaxUsage <= UsedCount) {
      return {
        Success: false,
        Message: 'run out of discount #01'
      }
    }

    let countUsagesBuyer = 0
    UsedBuyers.forEach((UsedBuyer) => {
      if (String(UsedBuyer) === buyerId) {
        countUsagesBuyer++
      }
    })

    if (MaxUsagesPerBuyer && MaxUsagesPerBuyer <= countUsagesBuyer) {
      return {
        Success: false,
        Message: 'run out of discount #02 '
      }
    }

    let totalPay = 0

    for (let i = 0; i < products.length; i++) {
      const currentProduct = await ProductModel.findById(products[i].productId)

      if (!currentProduct) {
        throw new InternalServerError('cannot compute the discount amount - exception')
      }

      if (String(currentProduct.Seller) === String(discount.Seller)) {
        if (
          discount.AppliedType === DiscountAppliedType.Specific &&
          !discount.AppliedProducts.includes(currentProduct._id)
        ) {
          continue
        } else {
          totalPay += products[i].quantity * currentProduct.ProductPrice
        }
      } else {
        return {
          Success: false,
          Message: 'the product is not supported'
        }
      }
    }

    if (MinOrderValue && MinOrderValue > totalPay) {
      return {
        Success: false,
        Message: 'does not meet the minimum value of total order'
      }
    }

    let discountAmount = 0
    if (discount.DiscountType === DiscountType.FixedAmount) {
      discountAmount = discount.DiscountValue
    }

    if (discount.DiscountType === DiscountType.Percentage) {
      discountAmount = (totalPay * discount.DiscountValue) / 100
    }

    return {
      Success: true,
      DiscountAmount: discountAmount
    }
  }
}

export default DiscountRepo
