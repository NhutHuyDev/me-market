import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, coerce, object, string } from 'zod'

export const AttributeQuerySchema = object({
  query: object({
    search: string().optional(),
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

export const AddAttributeSchema = object({
  body: object({
    attributeTitle: string().min(3, "attribute's name must be longer than 3 characters"),
    attributeDescription: string().min(
      20,
      "attribute's description must be longer than 20 characters"
    )
  })
})

export const UpdateAttributeSchema = object({
  body: object({
    attributeId: string().refine((attributeId) => IsValidObjectId(attributeId)),
    attributeTitle: string().min(3, "attribute's name must be longer than 3 characters"),
    attributeDescription: string().min(
      20,
      "attribute's description must be longer than 20 characters"
    )
  })
})

export const DeleteAttributeSchema = object({
  body: object({
    attributeId: string().refine((attributeId) => IsValidObjectId(attributeId))
  })
})

export type TAttributeQuerySchema = TypeOf<typeof AttributeQuerySchema>['query']
export type TAddAttributeSchema = TypeOf<typeof AddAttributeSchema>['body']
export type TUpdateAttributeSchema = TypeOf<typeof UpdateAttributeSchema>['body']
export type TDeleteAttributeSchema = TypeOf<typeof DeleteAttributeSchema>['body']
