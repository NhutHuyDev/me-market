import { IsValidObjectId } from '@src/utils/mongo.utils'
import { TypeOf, array, object, string } from 'zod'

export const AddCategorySchema = object({
  body: object({
    categoryCode: string(),
    categoryTitle: string(),
    categoryParent: string()
      .optional()
      .refine((categoryParent) => !categoryParent || IsValidObjectId(categoryParent)),
    categoryChildren: array(string())
      .optional()
      .refine(
        (categoryChildren) =>
          !categoryChildren ||
          categoryChildren.every((categoryChild) => IsValidObjectId(categoryChild))
      ),
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
    categoryChildren: array(string())
      .optional()
      .refine(
        (categoryChildren) =>
          !categoryChildren ||
          categoryChildren.every((categoryChild) => IsValidObjectId(categoryChild))
      ),
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

export type TAddCategorySchema = TypeOf<typeof AddCategorySchema>['body']
export type TUpdateCategorySchema = TypeOf<typeof UpdateCategorySchema>['body']
export type TDeleteCategorySchema = TypeOf<typeof DeleteCategorySchema>['body']
