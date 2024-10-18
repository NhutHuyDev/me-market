import { BadRequestResponse, ForbiddenResponse, UnauthorizedResponse } from '@src/core/error.responses'
import { InternalServerError, NotFoundError } from '@src/core/exceptions'
import { OkResponse } from '@src/core/success.responses'
import { VerifyJwt } from '@src/helpers/jwt'
import CredentialModel from '@src/models/credential.model'
import CredentialRepo from '@src/models/repositories/credential.repo'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import SessionRepo from '@src/models/repositories/session.repo'
import SessionModel from '@src/models/session.model'
import UserModel from '@src/models/user.model'
import { IsValidObjectId } from '@src/utils/mongo.utils'
import { string } from 'zod'

class AccessServices {
  static SignIn = async function (credLogin: string, credPassword: string) {
    /**
     * @description 1. kiểm tra credLogin
     */
    const userCredential = await CredentialRepo.FindByCredLogin(credLogin)

    if (!userCredential) {
      return new BadRequestResponse(`email is not correct`)
    }

    /**
     * @description 2. Validate credPassword
     */

    const isValid = await userCredential.ValidatePassword(credPassword)

    if (!isValid) {
      return new BadRequestResponse(`password is not correct`)
    }

    /**
     * @description 3. Lấy thông tin user hiện tại
     */

    const currentUser = await UserModel.findById(userCredential.User)

    if (!currentUser) {
      throw new NotFoundError()
    }

    /**
     * @description 4. Load thông tin khóa public
     */

    const keyPair = await KeyStoreRepo.GetKeyPairByAuthId(String(userCredential?._id))
    if (!keyPair) {
      throw new InternalServerError()
    }

    const signingKey = keyPair.PrivateKeyDecoding

    /**
     * @description 5. Ký và gửi các token
     */

    const accessToken = await SessionRepo.SignAccessToken(currentUser, signingKey)

    const refreshToken = await SessionRepo.SignRefreshToken(String(currentUser._id), signingKey)

    return new OkResponse({
      clientId: userCredential.User,
      accessToken,
      refreshToken
    })
  }

  static SignOut = async function (refreshToken: string, clientId: string) {
    if (clientId == '' || !IsValidObjectId(clientId)) {
      return new BadRequestResponse('clientId is not valid')
    }

    const currentAuth = await CredentialModel.findOne({
      User: clientId
    }) 
    if (!currentAuth) {
      return new ForbiddenResponse()
    }

    /**
     * @description 1. lấy cặp khóa public và private từ clientId
     */
    const keyPair = await KeyStoreRepo.GetKeyPairByAuthId(String(currentAuth._id))
    if (!keyPair) {
      return new ForbiddenResponse()
    }

    const verifyingKey = keyPair.PublicKeyDecoding

    /**
     * @description 2. Verify refresh token
     */
    const decoded = VerifyJwt<{ session: string }>(refreshToken, verifyingKey)

    if (!decoded) {
      return new UnauthorizedResponse('refresh token is not valid')
    }

    /**
     * @description 3. load session hiện tại của refresh token
     */
    const currentSession = await SessionModel.findById(decoded.session)

    if (!currentSession) {
      return new UnauthorizedResponse('session is not found')
    }

    if (!currentSession.Available) {
      return new BadRequestResponse(`session has already unavailable`)
    }

    /**
     * @description 4. disable current session
     */
    currentSession.Available = false

    await currentSession.save()

    return new OkResponse({
      message: 'sign out successfully'
    })
  }

  static RefreshAccessToken = async function (refreshToken: string, clientId: string) {
    if (clientId == '' || !IsValidObjectId(clientId)) {
      return new BadRequestResponse('clientId is not valid')
    }

    const currentAuth = await CredentialModel.findOne({
      User: clientId
    }) 
    if (!currentAuth) {
      return new ForbiddenResponse()
    }

    /**
     * @description 1. lấy cặp khóa public và private từ clientId
     */
    const keyPair = await KeyStoreRepo.GetKeyPairByAuthId(String(currentAuth._id))
    if (!keyPair) {
      return new ForbiddenResponse()
    }

    const verifyingKey = keyPair.PublicKeyDecoding
    const signingKey = keyPair.PrivateKeyDecoding

    /**
     * @description 2. Verify refresh token
     */
    const decoded = VerifyJwt<{ session: string }>(refreshToken, verifyingKey)

    if (!decoded) {
      throw new UnauthorizedResponse(`refresh access isn't valid`)
    }

    /**
     * @description 3. load session hiện tại của refresh token
     */
    const currentSession = await SessionModel.findById(decoded.session)

    if (!currentSession) throw new UnauthorizedResponse('session isn`t found')

    if (!currentSession.Available) throw new UnauthorizedResponse(`session isn't available`)

    /**
     * @description 4. kiểm tra refresh token gửi đến có nằm trong db hay không
     */

    if (currentSession.RefreshToken !== refreshToken)
      throw new UnauthorizedResponse(`refresh token isn't found`)

    /**
     * @description 5. tạo access token mới, thực hiện refresh token rotation và gửi chúng đi
     */
    const user = await UserModel.findById(clientId)

    if (!user) throw new InternalServerError()

    const accessToken = await SessionRepo.SignAccessToken(user, signingKey)

    const newRefreshToken = await SessionRepo.UpdateRefreshToken(
      String(currentSession._id),
      signingKey
    )

    return new OkResponse({ accessToken, refreshToken: newRefreshToken })
  }
}

export default AccessServices
