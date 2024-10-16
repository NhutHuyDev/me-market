import { Response } from 'express'

/**
 * @description API Response
 */

export class ApiResponse {
  code: number
  constructor(code: number) {
    this.code = code
  }

  Send(res: Response) {
    throw new Error("Method 'Send()' must be implemented.")
  }
}

/**
 * @description Success Response
 */

export class SuccessResponse extends ApiResponse {
  data: any
  constructor(code: number, metadata: any) {
    super(code)
    this.data = metadata
  }

  Send(res: Response) {
    return res.status(this.code).json(this.data)
  }
}

/**
 * @description Error Response
 */

export class ErrorResponse extends ApiResponse {
  message: string
  constructor(message: string, code: number) {
    super(code)
    this.message = message
  }

  Send(res: Response) {
    return res.status(this.code).json({
        message: this.message
      })
  }
}
