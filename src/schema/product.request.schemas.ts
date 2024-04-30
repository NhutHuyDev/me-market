import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, coerce, number, object, string, z } from 'zod'

export const ProductSchema = object({
  body: object({
    ProductId: string().optional(),
    ProductName: string({
      required_error: "product's name is required"
    }),
    ProductSlug: string().optional(),
    ProductThumb: string().optional(),
    ProductDescription: string({
      required_error: "product's description is required"
    }),
    ProductQuantity: number({
      invalid_type_error: "product's quantity is a integer",
      required_error: "product's quantity is required"
    }).min(1, "product's quantity has to be greater than 0"),
    ProductPrice: number({
      required_error: "product's price is required"
    }),
    Seller: string().optional(),
    ProductCategory: string({
      required_error: "product's category is required"
    })
  }).refine((data) => !data.ProductId || IsValidObjectId(data.ProductId), {
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

export type TProductSchema = TypeOf<typeof ProductSchema>['body']
export type TPublishProductSchema = TypeOf<typeof PublishProductSchema>['body']
export type TProductQuerySchema = TypeOf<typeof ProductQuerySchema>['query']
export type TProductParamsSchema = TypeOf<typeof ProductParamsSchema>['params']
