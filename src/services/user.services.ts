import { InternalServerError } from '@src/core/exceptions'
import RegisterOtpRepo from '@src/models/repositories/registerOtp.repo'
import UserRepo from '@src/models/repositories/user.repo'
import sendEmail from '@src/utils/mailer'
import path from 'path'
import fs from 'fs'
import UserModel from '@src/models/user.model'
import { TCreateUserSchema } from '@src/schema/user.request.schemas'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import CredentialModel from '@src/models/credential.model'
import { SystemRoles } from '@src/models/role.model'
import { BadRequestResponse, ConflictResponse } from '@src/core/error.responses'
import { CreatedResponse, OkResponse } from '@src/core/success.responses'

class UserServices {
  static RequestVerifyOtp = async function (email: string) {
    /**
     * @description 1. kiểm tra email đang được user nào sử dụng chưa
     */
    const existingUser = await UserRepo.FindByEmail(email)

    if (existingUser && existingUser.Verified) {
      return new ConflictResponse('email is already in use. Please use another email!')
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

      return new OkResponse({
        email,
        message: `access your email - ${email} to get reset password code`
      })
    } catch (error) {
      console.log(error)
      throw new InternalServerError()
    }
  }

  static VerifyUser = async function (email: string, candidateOtp: string) {
    /**
     * @description 1. kiểm tra có tồn tại yêu cầu xác thực cho email hiện tại hay không
     */
    const existingValidOtp = await RegisterOtpRepo.FindValidByEmail(email)
    if (!existingValidOtp) {
      return new BadRequestResponse('email or otp is not valid')
    }

    /**
     * @description 2. kiểm tra otp có hợp lệ hay không
     */
    if (await existingValidOtp.ValidateOtp(candidateOtp)) {
      existingValidOtp.CurrentOtp = null
      existingValidOtp.Verified = true

      await existingValidOtp.save()

      return new OkResponse({
        email: email,
        message: `verify email - ${email} successfully`
      })
    } else {
      return new BadRequestResponse('otp is not valid')
    }
  }

  static CreateUser = async function (input: TCreateUserSchema) {
    /**
     * @description 1. kiểm tra email đã được xác thực chưa
     */
    const isValidEmail = await RegisterOtpRepo.IsValidEmail(input.email)

    if (!isValidEmail) {
      return new BadRequestResponse('email is not verified')
    }

    /**
     * @description 2. tạo thông tin ban đầu cho user
     */
    const newUser = await UserModel.create({
      Email: input.email,
      FirstName: input.firstName,
      LastName: input.lastName,
      Mobile: input.mobile,
      Avatar: '/cloud/assets/img/default-customer-avatar.svg',
      Roles: [SystemRoles.Customer]
    })

    /**
     * @description 3. tạo key store
     */
    await KeyStoreRepo.Create(String(newUser._id))

    /**
     * @description 4. tạo thông tin đăng nhập
     */
    await CredentialModel.create({
      User: newUser._id,
      CredLogin: input.email,
      CredPassword: input.credPassword
    })

    return new CreatedResponse({
      email: input.email,
      messsage: 'create user successfull'
    })
  }
}

export default UserServices
