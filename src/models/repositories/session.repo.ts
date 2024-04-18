import { omit } from 'lodash'
import { IUser } from '../user.model'
import { Document, Schema } from 'mongoose'
import { signJwt } from '@src/helpers/jwt'
import config from '@src/config'
import SessionModel from '../session.model'

class SessionRepo {
  static SignRefreshToken = async function (userId: string, signingKey: string) {
    const session = await SessionModel.create({ user: userId })

    const refreshToken = signJwt(
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
    user: Document<unknown, object, IUser>,
    signingKey: string
  ) {
    const payload = omit(user.toJSON(), ['verified', 'deleted', '__v'])

    const accessToken = signJwt(payload, signingKey, {
      expiresIn: config.app.access_token_expiration
    })

    return accessToken
  }
}

export default SessionRepo
