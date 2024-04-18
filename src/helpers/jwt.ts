import jwt, { Jwt } from 'jsonwebtoken'

export function signJwt(
  object: object,
  signingKey: string,
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

export function verifyJwt<T>(token: string, verifyingKey: string): T | null {
  try {
    const decoded = jwt.verify(token, verifyingKey) as T
    return decoded
  } catch (error) {
    return null
  }
}

export function decodeJwt(token: string): any {
  return jwt.decode(token, { complete: true })
}
