import { Response } from 'express'
import { STATUS_CODE } from '@src/utils/httpStatusRespones'
import { SuccessResponse } from './response'

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
