import { BadRequestError, NotFoundError, UnauthorizedError } from '@src/core/error.responses'
import { verifyJwt } from '@src/helpers/jwt'
import CredentialRepo from '@src/models/repositories/credential.repo'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import SessionRepo from '@src/models/repositories/session.repo'
import SessionModel from '@src/models/session.model'
import UserModel from '@src/models/user.model'

class AccessServices {
  static SignIn = async function (credLogin: string, credPassword: string) {
    /**
     * @description 1. kiểm tra credLogin
     */
    const userCredential = await CredentialRepo.FindByCredLogin(credLogin)

    if (!userCredential) {
      throw new BadRequestError(`email isn't correct`)
    }

    /**
     * @description 2. Validate credPassword
     */

    const isValid = await userCredential.ValidatePassword(credPassword)

    if (!isValid) {
      throw new BadRequestError(`password isn't correct`)
    }

    /**
     * @description 3. Load thông tin user hiện tại
     */

    const currentUser = await UserModel.findById(userCredential.User)

    if (!currentUser) {
      throw new NotFoundError()
    }

    /**
     * @description 4. Load thông tin khóa public
     */

    const keyPair = await KeyStoreRepo.GetKeyPairByUserId(String(currentUser?._id))

    const signingKey = keyPair.PrivateKeyDecoding

    /**
     * @description 5. Ký và gửi các token
     */

    const accessToken = await SessionRepo.SignAccessToken(currentUser, signingKey)

    const refreshToken = await SessionRepo.SignRefreshToken(String(currentUser._id), signingKey)

    return {
      clientId: userCredential.User,
      accessToken,
      refreshToken
    }
  }

  static SignOut = async function (refreshToken: string, clientId: string) {
    /**
     * @description 1. lấy cặp khóa public và private từ clientId
     */
    const keyPair = await KeyStoreRepo.GetKeyPairByUserId(clientId)

    const verifyingKey = keyPair.PublicKeyDecoding

    /**
     * @description 2. Verify refresh token
     */
    const decoded = verifyJwt<{ session: string }>(refreshToken, verifyingKey)

    if (!decoded) throw new UnauthorizedError('refresh token is not valid')

    /**
     * @description 3. load session hiện tại của refresh token
     */
    const currentSession = await SessionModel.findById(decoded.session)

    if (!currentSession) throw new UnauthorizedError('session is not found')

    if (!currentSession.Available) throw new BadRequestError(`session has already unavailable`)

    /**
     * @description 4. kiểm tra lần nữa current session có thuộc về clientId không
     */
    if (String(currentSession.User) !== clientId)
      throw new UnauthorizedError(`clientId is not valid`)

    /**
     * @description 5. disable current session
     */
    currentSession.Available = false

    currentSession.save()

    return {
      message: 'sign out successfully'
    }
  }
}

export default AccessServices
