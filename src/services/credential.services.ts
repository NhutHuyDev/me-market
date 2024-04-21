import { InternalServerError } from '@src/core/exceptions'
import path from 'path'
import fs from 'fs'
import UserRepo from '@src/models/repositories/user.repo'
import CredentialRepo from '@src/models/repositories/credential.repo'
import sendEmail from '@src/utils/mailer'
import { BadRequestResponse, InternalServerResponse } from '@src/core/error.responses'

class CredentialServices {
  static RequestResetPassword = async function (email: string) {
    /**
     * @description 1. kiểm tra email có tồn tại hay không
     */
    const user = await UserRepo.FindByEmail(email)
    if (!user) {
      throw new BadRequestResponse("email doesn't exist, please create your account")
    }

    /**
     * @description 2. sinh mới và lưu passwordResetCode
     */
    const userCredential = await CredentialRepo.FindByUserId(String(user._id))

    if (!userCredential) throw new InternalServerResponse()

    const passwordResetCode = userCredential.GeneratePasswordResetCode()
    await userCredential.save()

    // const resetPasswordUrl = `http://localhost:3000/auth/new-password/${user._id}/${passwordResetCode}`

    /**
     * @description 3. tạo template để gửi mail
     */
    const parentDir = path.resolve(__dirname, '..')

    const emailTemplate = fs.readFileSync(
      path.join(parentDir, 'templates/resetPassword.template.html'),
      'utf-8'
    )

    const html = emailTemplate
      .replace('{{passwordResetCode}}', passwordResetCode)
      .replace('{{userId}}', String(userCredential.User))

    /**
     * @description 4. gửi mail
     */
    await sendEmail({
      to: user.Email,
      from: 'test@example.com',
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
      html: html
    })
    console.log(`Verify OTP sent to ${email}`)
    return {
      email: email,
      message: `access your email - ${email} to get reset password code`
    }
  }

  static ResetPassword = async function (
    userId: string,
    newPassword: string,
    passwordResetCode: string
  ) {
    /**
     * @description 1. kiểm tra có tồn tại yêu cầu reset lại password hay không
     */
    const userCredential = await CredentialRepo.FindValidRequestResetPassword(userId)

    if (!userCredential) throw new BadRequestResponse('could not reset user password')

    /**
     * @description 2. kiểm tra password reset code có tồn tại trong database hay không
     */
    if (!userCredential.PasswordResetCode) {
      throw new BadRequestResponse('could not reset user password')
    }

    /**
     * @description 3. validation password reset code
     */
    if (await userCredential.ValidatePasswordResetCode(passwordResetCode)) {
      userCredential.PasswordResetCode = null
      userCredential.PasswordResetExpires = null
      userCredential.CredPassword = newPassword
      await userCredential.save()

      return {
        message: 'successfully updated user password'
      }
    }

    throw new BadRequestResponse('could not reset user password')
  }
}

export default CredentialServices
