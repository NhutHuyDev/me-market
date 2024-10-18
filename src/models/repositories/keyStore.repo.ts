import mongoose, { Schema } from 'mongoose'
import KeyStoreModel from '../keyStore.model'
import { GenerateRSAKeyPair } from '@src/helpers/rsa'

class KeyStoreRepo {
  static Create = async function (authId: string, session: mongoose.mongo.ClientSession) {
    const { PublicKey, PrivateKey } = GenerateRSAKeyPair()

    const publicKeyEncoding = Buffer.from(PublicKey).toString('base64')
    const privateKeyEncoding = Buffer.from(PrivateKey).toString('base64')

    return KeyStoreModel.create([{
      AuthCredential: authId,
      PublicKey: publicKeyEncoding,
      PrivateKey: privateKeyEncoding
    }], { session })
  }

  static GetKeyPairByAuthId = async function (authId: string) {
    if (!authId) {
      return 
    }

    const keyPair = await KeyStoreModel.findOne({
      AuthCredential: new mongoose.Types.ObjectId(authId)
    })

    const { PublicKey, PrivateKey } = keyPair ? keyPair.toJSON() : { PublicKey: '', PrivateKey: '' }

    const PublicKeyDecoding = Buffer.from(PublicKey, 'base64').toString('ascii')
    const PrivateKeyDecoding = Buffer.from(PrivateKey, 'base64').toString('ascii')

    return {
      PublicKeyDecoding,
      PrivateKeyDecoding
    }
  }
}

export default KeyStoreRepo
