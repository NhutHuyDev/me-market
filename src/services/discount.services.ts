import { OkResponse } from '@src/core/success.responses'
import DiscountModel from '@src/models/discount.model'
import { TDiscountSchema } from '@src/schema/discount.request.schemas'

class DiscountServices {
  static Create = async function (input: TDiscountSchema) {
    const newDiscount = await DiscountModel.create({
      ...input
    })

    return new OkResponse({
      newDiscount: newDiscount
    })
  }
  static Update = async function (input: TDiscountSchema) {}
  static FindAll = async function () {}
  static GetProductsInDiscount = async function () {}
  static CancelUsingDiscount = async function () {}
  static DeleteDiscount = async function () {}
  static ComputeDiscountAmount = async function () {}
}

export default DiscountServices
