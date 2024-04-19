import { STATUS_CODE, DEFAULT_STATUS_MESSAGE } from '@src/utils/httpStatusRespones'

enum ExceptionStatus {
  Error = 'error',
  Fail = 'fail'
}

class Exception extends Error {
  code: number
  status: string
  constructor(message: string, statusCode: number, status: string) {
    super(message)
    this.code = statusCode
    this.status = status
  }
}

/**
 * @description  Not found exception
 */

export class NotFoundError extends Exception {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND,
    status = ExceptionStatus.Error
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description  Internal server exception
 */
export class InternalServerError extends Exception {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    status = ExceptionStatus.Fail
  ) {
    super(message, statusCode, status)
  }
}
