import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, array, number, object, string } from 'zod'

export const AddToCartSchema = object({
  body: object({
    productId: string({
      required_error: "product's id is required"
    }).refine((data) => IsValidObjectId(data), "product's id is not valid"),
    quantity: number({
      required_error: "product's quantity is required",
      invalid_type_error: "product'quantity must be a positive integer"
    }).min(1, "product'quantity must be a positive integer")
  })
})

export const UpdateQuantitySchema = object({
  body: object({
    productId: string({
      required_error: "product's id is required"
    }).refine((data) => IsValidObjectId(data), "product's id is not valid"),
    newQuantity: number({
      required_error: "product's quantity is required",
      invalid_type_error: "product'quantity must be a positive integer"
    }).min(1, "product'quantity must be a positive integer")
  })
})

export const RemoveProductsSchema = object({
  body: object({
    productIds: array(string(), { required_error: "product's id is required" }).refine(
      (data) => data.every((productId) => IsValidObjectId(productId)),
      "some product's ids is not valid"
    )
  })
})

export type TAddToCartSchema = TypeOf<typeof AddToCartSchema>['body']
export type TUpdateQuantitySchema = TypeOf<typeof UpdateQuantitySchema>['body']
export type TRemoveProductsSchema = TypeOf<typeof RemoveProductsSchema>['body']
