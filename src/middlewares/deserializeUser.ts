import { Request, Response, NextFunction } from 'express'
import { VerifyJwt } from '@src/helpers/jwt'
import customHttpHeaders from '@src/utils/customHttpHeaders'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import UserModel, { TUser } from '@src/models/user.model'
import { IsValidObjectId } from '@src/utils/mongo.utils'
import UserRepo from '@src/models/repositories/user.repo'
import CredentialModel from '@src/models/credential.model'

const DeserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '')

  const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

  if (!accessToken || !clientId || !IsValidObjectId(clientId)) {
    return next()
  }

  const currentAuth = await CredentialModel.findOne({
    User: clientId
  })
  if (!currentAuth) {
    return next()
  }

  const keyPair = await KeyStoreRepo.GetKeyPairByAuthId(String(currentAuth._id))
  if (!keyPair) {
    return next()
  }

  const verifyingKey = keyPair.PublicKeyDecoding

  const decoded = VerifyJwt(accessToken, verifyingKey) as TUser

  if (decoded) {
    res.locals.user = decoded
  }

  return next()
}

export default DeserializeUser
