import { Request, Response, NextFunction } from 'express'
import { VerifyJwt } from '@src/helpers/jwt'
import customHttpHeaders from '@src/utils/customHttpHeaders'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import { IUser } from '@src/models/user.model'
import IsValidObjectId from '@src/utils/checkValidObjectId'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')

  const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

  if (!accessToken || !clientId || !IsValidObjectId(clientId)) {
    return next()
  }

  const keyPair = await KeyStoreRepo.GetKeyPairByUserId(clientId)

  const verifyingKey = keyPair.PublicKeyDecoding

  const decoded = VerifyJwt(accessToken, verifyingKey) as IUser

  if (decoded) {
    res.locals.user = decoded
  }

  return next()
}

export default deserializeUser
