import { Request, Response, NextFunction } from 'express'

type AsyncFunction<T = any, U = any> = (
  req: Request<T>,
  res: Response<U>,
  next: NextFunction
) => Promise<any>

const HandleException = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: any) => {
      next(error)
    })
  }
}

export default HandleException
