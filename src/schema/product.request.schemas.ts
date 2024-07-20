import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, any, array, coerce, number, object, string, z } from 'zod'

export const AddProductSchema = object({
  body: object({
    productName: string({
      required_error: "product's name is required"
    }),
    productDescription: string({
      required_error: "product's description is required"
    }),
    productThumb: string().optional(),
    productQuantity: number({
      invalid_type_error: "product's quantity is a integer",
      required_error: "product's quantity is required"
    }).min(1, "product's quantity has to be greater than 0"),
    productPrice: number({
      required_error: "product's price is required"
    }),
    seller: string().optional(),
    productCategory: string({
      required_error: "product's category is required"
    }).refine((productCategory) => IsValidObjectId(productCategory)),
    productAttributes: array(
      object({
        productAttributeId: string(),
        value: string()
      })
    ).refine((productAttributes) =>
      productAttributes.every((productAttribute) =>
        IsValidObjectId(productAttribute.productAttributeId)
      )
    )
  })
})

export const UpdateProductSchema = object({
  body: object({
    productId: string(),
    productName: string({
      required_error: "product's name is required"
    }),
    productDescription: string({
      required_error: "product's description is required"
    }),
    productQuantity: number({
      invalid_type_error: "product's quantity is a integer",
      required_error: "product's quantity is required"
    }).min(1, "product's quantity has to be greater than 0"),
    productPrice: number({
      required_error: "product's price is required"
    }),
    seller: string().optional(),
    productCategory: string({
      required_error: "product's category is required"
    }),
    productAttributes: array(
      object({
        productAttributeId: string(),
        value: string()
      })
    ).refine((productAttributes) =>
      productAttributes.every((productAttribute) =>
        IsValidObjectId(productAttribute.productAttributeId)
      )
    )
  }).refine((data) => IsValidObjectId(data.productId), {
    message: "product's id is not valid"
  })
})

export const PublishProductSchema = object({
  body: object({
    ProductId: string({
      required_error: "product's Id is required"
    })
  }).refine((data) => IsValidObjectId(data.ProductId), {
    message: "product's id is not valid"
  })
})

export const ProductQuerySchema = object({
  query: object({
    search: string().optional(),
    categories: string().optional(),
    price: string()
      .regex(/^(\d{1,8}|)(,(|\d{1,8}))?$/, 'price query is not valid')
      .optional(),
    status: z.enum(['draft', 'published']).optional(),
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

export const ProductParamsSchema = object({
  params: object({
    ProductId: string({
      required_error: "product's Id is required"
    }),
    ProductSlug: string().optional()
  }).refine((data) => IsValidObjectId(data.ProductId), {
    message: "product's id is not valid"
  })
})

export type TAddProductSchema = TypeOf<typeof AddProductSchema>['body']
export type TUpdateProductSchema = TypeOf<typeof UpdateProductSchema>['body']
export type TPublishProductSchema = TypeOf<typeof PublishProductSchema>['body']
export type TProductQuerySchema = TypeOf<typeof ProductQuerySchema>['query']
export type TProductParamsSchema = TypeOf<typeof ProductParamsSchema>['params']
