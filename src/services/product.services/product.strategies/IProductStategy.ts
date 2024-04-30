import { IProduct } from '@src/models/product.model'

export default interface IProductStategy {
  Create(input: any): Promise<any>
  Update(input: any): Promise<any>
}

export type TProductStategyResponse = {
  success: boolean
  product?: IProduct
  message?: string
}
