import express, { Request, Response, NextFunction } from 'express'
import { NotFoundError } from '@src/core/error.responses'

const router = express.Router()

router.get('/v1/api/health-check', (_, res) => res.sendStatus(200))

/**
 * @description 404 handling
 */
router.use((req, res, next) => {
  const error = new NotFoundError()
  next(error)
})

/**
 * @description error handling
 */
router.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error.stack)
  const status = error.code >= 400 && error.code < 500 ? 'error' : 'fail'
  return res.status(error.code || 500).json({
    code: error.code || 500,
    status: status,
    message: error.message || 'Internal server error'
  })
})

export default router
