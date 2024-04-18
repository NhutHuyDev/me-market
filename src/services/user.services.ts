import { ConflictError, InternalServerError } from '@src/core/error.responses'
import RegisterOtpRepo from '@src/models/repositories/registerOtp.repo'
import UserRepo from '@src/models/repositories/user.repo'
import sendEmail from '@src/utils/mailer'
import path from 'path'
import fs from 'fs'

class UserServices {
  static RequestVerifyOtp = async function (email: string) {
    /**
     * @description 1. kiểm tra email đang được user nào sử dụng chưa
     */
    const existingUser = await UserRepo.FindByEmail(email)

    if (existingUser && existingUser.Verified) {
      throw new ConflictError('email is already in use. Please use another email!')
    }

    /**
     * @description 2. kiểm tra đã tồn tại yêu cầu xác thức trước đó chưa
     *                2.1. chưa - tạo và lưu otp mới cho email
     *                2.2. rồi - update otp mới cho email
     */
    let newOtp = null

    const existingRequest = await RegisterOtpRepo.FindByEmail(email)
    if (!existingRequest) {
      const registerOtp = await RegisterOtpRepo.Create(email)
      newOtp = registerOtp.GenerateOtp()
      registerOtp.save()
    } else {
      newOtp = existingRequest.GenerateOtp()
      existingRequest.save()
    }

    /**
     * @description 3. gửi mail
     */
    try {
      const parentDir = path.resolve(__dirname, '..')
      const verifyEmailTemplate = fs.readFileSync(
        path.join(parentDir, 'templates/verifyUser.template.html'),
        'utf-8'
      )

      const html = verifyEmailTemplate.replace('{{otp}}', newOtp)

      await sendEmail({
        to: email,
        from: 'nguyennhuthuy.dev@gmail.com',
        subject: 'Verify your email from MeMarket',
        html: html
      })

      console.log(`Password reset email sent to ${email}`)

      return {
        email,
        message: `access your email - ${email} to get reset password code`
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerError('Internal Server Error - Send Email Fail')
    }
  }
}

export default UserServices
