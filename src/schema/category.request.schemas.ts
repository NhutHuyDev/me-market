import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, array, coerce, object, string } from 'zod'

export const AddCategorySchema = object({
  body: object({
    categoryCode: string({ required_error: "category's code is required" }),
    categoryTitle: string({ required_error: "category's title is required" }),
    categoryParent: string()
      .optional()
      .refine((categoryParent) => !categoryParent || IsValidObjectId(categoryParent)),
    requiredAttributes: array(string()).refine((requiredAttributes) =>
      requiredAttributes.every((requiredAttribute) => IsValidObjectId(requiredAttribute))
    ),
    optionalAttributes: array(string())
      .optional()
      .refine(
        (optionalAttributes) =>
          !optionalAttributes ||
          optionalAttributes.every((optionalAttribute) => IsValidObjectId(optionalAttribute))
      )
  })
})

export const UpdateCategorySchema = object({
  body: object({
    categoryId: string().refine((categoryId) => IsValidObjectId(categoryId)),
    categoryCode: string(),
    categoryTitle: string(),
    categoryParent: string()
      .optional()
      .refine((categoryParent) => !categoryParent || IsValidObjectId(categoryParent)),
    requiredAttributes: array(string()).refine((requiredAttributes) =>
      requiredAttributes.every((requiredAttribute) => IsValidObjectId(requiredAttribute))
    ),
    optionalAttributes: array(string())
      .optional()
      .refine(
        (optionalAttributes) =>
          !optionalAttributes ||
          optionalAttributes.every((optionalAttribute) => IsValidObjectId(optionalAttribute))
      )
  })
})

export const DeleteCategorySchema = object({
  body: object({
    categoryId: string().refine((categoryId) => IsValidObjectId(categoryId))
  })
})

export const CategoryQuerySchema = object({
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

export type TAddCategorySchema = TypeOf<typeof AddCategorySchema>['body']
export type TUpdateCategorySchema = TypeOf<typeof UpdateCategorySchema>['body']
export type TDeleteCategorySchema = TypeOf<typeof DeleteCategorySchema>['body']
export type TCategoryQuerySchema = TypeOf<typeof CategoryQuerySchema>['query']
