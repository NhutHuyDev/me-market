import { DiscountAppliedType, DiscountType } from '@src/models/discount.model'
import { IsValidObjectId } from '@src/utils/mongo.utils'
import { array, boolean, coerce, nativeEnum, number, object, set, string, TypeOf, z } from 'zod'

export const DiscountSchema = object({
  body: object({
    DiscountId: string()
      .optional()
      .refine((data) => !data || IsValidObjectId(data)),
    DiscountCode: string({ required_error: "discount's code is required" }),
    DiscountName: string({ required_error: "discount's name is required" }),
    DiscountDescription: string({ required_error: "discount's name is required" }),
    DiscountType: nativeEnum(DiscountType, {
      invalid_type_error: "discount's type is not supported"
    }),
    DiscountValue: number({
      required_error: "discount's value is required"
    }).min(1, "discount's value is a positite integer"),
    StartDate: coerce
      .date({
        required_error: "discount's start date is required",
        invalid_type_error: 'discount hello'
      })
      .refine((data) => data >= new Date(), { message: 'start date must be in the future' }),
    EndDate: coerce.date({ invalid_type_error: "discount's end date is required" }),
    MaxUsage: number({
      required_error: "discount's value is required"
    })
      .min(1, "discount's max usage is a positive integer")
      .optional(),
    ForCustomers: array(string())
      .optional()
      .refine((data) => !data || new Set(data).size === data.length, "duplicate customer'id")
      .refine(
        (data) => data?.every((customerId) => IsValidObjectId(customerId)),
        "a customer'id is not valid"
      ),
    MaxUsagesPerBuyer: number().min(1, 'max usage per buyer is a positive integer').optional(),
    MinOrderValue: number().min(1, 'min order valud is a positive integer').optional(),
    Seller: string().optional(),
    IsActive: boolean({ invalid_type_error: 'IsActive is not valid' }).optional(),
    AppliedType: nativeEnum(DiscountAppliedType, {
      invalid_type_error: 'applied Type is not supported'
    }),
    AppliedProducts: array(string())
      .optional()
      .refine((data) => !data || new Set(data).size === data.length, "duplicate product'id")
      .refine(
        (data) => data?.every((customerId) => IsValidObjectId(customerId)),
        "a product'id is not valid"
      )
  }).refine((data) => data.EndDate > data.StartDate, {
    message: 'end date cannot be earlier than start date.',
    path: ['EndDate']
  })
})

export const DiscountQuerySchema = object({
  query: object({
    search: string().optional(),
    type: nativeEnum(DiscountType).optional(),
    applied_type: nativeEnum(DiscountAppliedType).optional(),
    status: z.enum(['active', 'inactive']).optional(),
    sort_by: string().optional(),
    limit: coerce
      .number({ invalid_type_error: 'limit has to be a positive integer' })
      .min(10, 'limit have to greater than or equal to 10')
      .optional(),
    page: coerce
      .number({ invalid_type_error: 'page has to be a positive integer' })
      .int()
      .min(1, 'page has to be greater than 0')
      .optional()
  })
})

export const ComputeDiscountAmount = object({
  body: object({
    discountId: string().refine((discountId) => IsValidObjectId(discountId)),
    products: array(
      object({
        productId: string().refine(
          (productId) => IsValidObjectId(productId),
          "product's id is not valid"
        ),
        quantity: number({
          required_error: "product's quantity is required",
          invalid_type_error: "product's quantity must be a positive integer"
        }).min(1, "product's quantity must be a positive integer")
      })
    ).refine((products) => products.length, 'product is required')
  })
})

export type TDiscountSchema = TypeOf<typeof DiscountSchema>['body']
export type TDiscountQuerySchema = TypeOf<typeof DiscountQuerySchema>['query']
export type TComputeDiscountAmount = TypeOf<typeof ComputeDiscountAmount>['body']
