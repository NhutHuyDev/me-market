import { STATUS_CODE, DEFAULT_STATUS_MESSAGE } from '@src/utils/httpStatusRespones'
import { ErrorResponse, ErrorStatus } from './response'

/**
 * @description Bad request response
 */
export class BadRequestResponse extends ErrorResponse {
  constructor(message = DEFAULT_STATUS_MESSAGE.BAD_REQUEST) {
    super(message, STATUS_CODE.BAD_REQUEST, ErrorStatus.Error)
  }
}

/**
 * @description Conflict response
 */
export class ConflictResponse extends ErrorResponse {
  constructor(message = DEFAULT_STATUS_MESSAGE.CONFLICT) {
    super(message, STATUS_CODE.CONFLICT, ErrorStatus.Error)
  }
}

/**
 * @description Unauthorized response
 */
export class UnauthorizedResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.UNAUTHORIZED,
    statusCode = STATUS_CODE.UNAUTHORIZED,
    status = ErrorStatus.Error
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description Forbidden error
 */
export class ForbiddenResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN,
    status = ErrorStatus.Error
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description  Not found error
 */

export class NotFoundResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND,
    status = ErrorStatus.Error
  ) {
    super(message, statusCode, status)
  }
}

/**
 * @description  Internal server error
 */
export class InternalServerResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    status = ErrorStatus.Fail
  ) {
    super(message, statusCode, status)
  }
}
