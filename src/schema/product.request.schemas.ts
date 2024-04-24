import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, number, object, string } from 'zod'

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

export type TProductSchema = TypeOf<typeof ProductSchema>['body']
export type TPublishProductSchema = TypeOf<typeof PublishProductSchema>['body']
