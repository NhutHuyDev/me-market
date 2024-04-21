import { Response } from 'express'

/**
 * @description API Response
 */

export class ApiResponse {
  code: number
  constructor(statusCode: number) {
    this.code = statusCode
  }

  Send(res: Response) {
    return res.status(this.code).json(this)
  }
}

/**
 * @description Success Response
 */

export class SuccessResponse extends ApiResponse {
  status: string
  data: any
  constructor(statusCode: number, metadata: any) {
    super(statusCode)
    this.status = 'sucess'
    this.data = metadata
  }

  Send(res: Response) {
    return res.status(this.code).json(this)
  }
}

/**
 * @description Error Response
 */

export enum ErrorStatus {
  Error = 'error',
  Fail = 'fail'
}

export class ErrorResponse extends ApiResponse {
  message: string
  status: string
  constructor(message: string, statusCode: number, status: string) {
    super(statusCode)
    this.message = message
    this.status = status
  }

  Send(res: Response) {
    return res.status(this.code).json(this)
  }
}
