import jwt, { Jwt } from 'jsonwebtoken'

export function SignJwt(object: object, signingKey: string, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256'
  })
}

export function VerifyJwt<T>(token: string, verifyingKey: string): T | null {
  try {
    const decoded = jwt.verify(token, verifyingKey) as T
    return decoded
  } catch (error) {
    return null
  }
}

export function DecodeJwt(token: string): any {
  return jwt.decode(token, { complete: true })
}
