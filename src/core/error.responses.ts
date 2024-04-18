import { STATUS_CODE, DEFAULT_STATUS_MESSAGE } from '@src/utils/httpStatusRespones'

class ErrorResponse extends Error {
  code: number
  status: string
  constructor(message: string, statusCode: number, status: string) {
    super(message)
    this.code = statusCode
    this.status = status
  }
}

/**
 * @description Bad request error
 */
export class BadRequestError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description Conflict error
 */
export class ConflictError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description Unauthorized error
 */
export class UnauthorizedError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.UNAUTHORIZED,
    statusCode = STATUS_CODE.UNAUTHORIZED,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description Forbidden error
 */
export class ForbiddenError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description  Internal server error
 */
export class InternalServerError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description  Not found error
 */

export class NotFoundError extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND,
    status = 'error'
  ) {
    super(message, statusCode, status)
  }
}
