import { Response } from 'express'
import { STATUS_CODE } from '@src/utils/httpStatusRespones'

class SuccessResponse {
  code: number
  status: string
  data: any
  constructor(statusCode: number, metadata: any) {
    this.code = statusCode
    this.status = 'sucess'
    this.data = metadata
  }

  send(res: Response) {
    return res.status(this.code).json(this)
  }
}

/**
 * @description Ok response
 */
export class OkResponse extends SuccessResponse {
  constructor(metadata: any) {
    super(STATUS_CODE.OK, metadata)
  }
}

/**
 * @description Created response
 */
export class CreatedResponse extends SuccessResponse {
  constructor(metadata: any) {
    super(STATUS_CODE.CREATED, metadata)
  }
}
