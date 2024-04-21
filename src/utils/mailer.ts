import nodemailer, { SendMailOptions } from 'nodemailer'
import config from '@src/config'
import { InternalServerError } from '@src/core/exceptions'
import { OAuth2Client } from 'google-auth-library'

const GOOGLE_MAILER_CLIENT_ID = config.smtp.clientId
const GOOGLE_MAILER_CLIENT_SECRET = config.smtp.clientSecret
const GOOGLE_MAILER_REFRESH_TOKEN = config.smtp.refreshToken
const ADMIN_EMAIL_ADDRESS = config.smtp.user

/**
 * @description khởi tạo OAuth2Client với Client ID và Client Secret
 */
const myOAuth2Client = new OAuth2Client(GOOGLE_MAILER_CLIENT_ID, GOOGLE_MAILER_CLIENT_SECRET)
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})

async function SendEmail(payload: SendMailOptions) {
  const myAccessTokenObject = await myOAuth2Client.getAccessToken()

  const accessToken = myAccessTokenObject?.token

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL_ADDRESS,
      clientId: GOOGLE_MAILER_CLIENT_ID,
      clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
      refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: accessToken || ''
    }
  })

  transporter.sendMail(payload, (err, info) => {
    if (err) {
      console.log('sending email error')
      throw new InternalServerError('sending email error')
    }
  })
}

export default SendEmail
