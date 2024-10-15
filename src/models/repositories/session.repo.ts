import { TUser } from '../user.model'
import { Document } from 'mongoose'
import { DecodeJwt, SignJwt } from '@src/helpers/jwt'
import config from '@src/config'
import SessionModel from '../session.model'

class SessionRepo {
  static SignRefreshToken = async function (userId: string, signingKey: string) {
    const session = await SessionModel.create({ User: userId })

    const refreshToken = SignJwt(
      {
        session: session._id
      },
      signingKey,
      {
        expiresIn: config.app.refresh_token_expiration
      }
    )

    session.RefreshToken = refreshToken

    await session.save()

    return refreshToken
  }

  static SignAccessToken = async function (
    user: Document<unknown, object, TUser>,
    signingKey: string
  ) {
    const payload = user.toJSON()

    const accessToken = SignJwt(payload, signingKey, {
      expiresIn: config.app.access_token_expiration
    })

    return accessToken
  }

  static UpdateRefreshToken = async function (userId: string, signingKey: string) {
    const currentSession = await SessionModel.findById(userId)

    if (currentSession) {
      const currentRefreshToken = currentSession.RefreshToken

      const decodeRefreshToken = currentRefreshToken ? DecodeJwt(currentRefreshToken) : null

      if (!decodeRefreshToken || !decodeRefreshToken.payload.exp) return null

      const oldExpiredTime = decodeRefreshToken.payload.exp

      const newRefreshToken = SignJwt(
        {
          session: currentSession._id
        },
        signingKey,
        {
          expiresIn: oldExpiredTime - Math.floor(Date.now() / 1000)
        }
      )

      currentSession.RefreshToken = newRefreshToken
      currentSession.save()

      return newRefreshToken
    } else {
      return null
    }
  }
}

export default SessionRepo
