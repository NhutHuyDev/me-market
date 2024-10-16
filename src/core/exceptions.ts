import { STATUS_CODE, DEFAULT_STATUS_MESSAGE } from '@src/utils/httpStatusRespones'

class Exception extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

/**
 * @description  Not found exception
 */

export class NotFoundError extends Exception {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.NOT_FOUND,
    code = STATUS_CODE.NOT_FOUND,
  ) {
    super(message, code)
  }
}

/**
 * @description  Internal server exception
 */
export class InternalServerError extends Exception {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    code = STATUS_CODE.INTERNAL_SERVER_ERROR,
  ) {
    super(message, code)
  }
}
