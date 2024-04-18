import { Schema } from 'mongoose'
import KeyStoreModel from '../keyStore.model'
import { generateRSAKeyPair } from '@src/helpers/rsa'

class KeyStoreRepo {
  static Create = async function (userId: string) {
    const { publicKey, privateKey } = generateRSAKeyPair()

    const publicKeyEncoding = Buffer.from(publicKey).toString('base64')
    const privateKeyEncoding = Buffer.from(privateKey).toString('base64')

    return KeyStoreModel.create({
      User: new Schema.Types.ObjectId(userId),
      PublicKey: publicKeyEncoding,
      PrivateKey: privateKeyEncoding
    })
  }

  static GetKeyPairByUserId = async function (userId: string) {
    const keyPair = await KeyStoreModel.findOne({
      User: new Schema.Types.ObjectId(userId)
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
