import { STATUS_CODE, DEFAULT_STATUS_MESSAGE } from '@src/utils/httpStatusRespones'
import { ErrorResponse } from './response'

/**
 * @description Bad request response
 */
export class BadRequestResponse extends ErrorResponse {
  constructor(message = DEFAULT_STATUS_MESSAGE.BAD_REQUEST) {
    super(message, STATUS_CODE.BAD_REQUEST)
  }
}

/**
 * @description Conflict response
 */
export class ConflictResponse extends ErrorResponse {
  constructor(message = DEFAULT_STATUS_MESSAGE.CONFLICT) {
    super(message, STATUS_CODE.CONFLICT)
  }
}

/**
 * @description Unauthorized response
 */
export class UnauthorizedResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.UNAUTHORIZED,
  ) {
    super(message, STATUS_CODE.UNAUTHORIZED)
  }
}

/**
 * @description Forbidden error
 */
export class ForbiddenResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.FORBIDDEN,
  ) {
    super(message, STATUS_CODE.FORBIDDEN)
  }
}

/**
 * @description  Not found error
 */

export class NotFoundResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.NOT_FOUND,
    code = STATUS_CODE.NOT_FOUND,
  ) {
    super(message, code)
  }
}

/**
 * @description  Internal server error
 */
export class InternalServerResponse extends ErrorResponse {
  constructor(
    message = DEFAULT_STATUS_MESSAGE.INTERNAL_SERVER_ERROR,
    code = STATUS_CODE.INTERNAL_SERVER_ERROR,
  ) {
    super(message, code)
  }
}
