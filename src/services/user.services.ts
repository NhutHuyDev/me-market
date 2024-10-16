import UserRepo from '@src/models/repositories/user.repo'
import sendEmail from '@src/utils/mailer'
import path from 'path'
import fs from 'fs'
import UserModel from '@src/models/user.model'
import { TCreateUserSchema } from '@src/schema/user.request.schemas'
import KeyStoreRepo from '@src/models/repositories/keyStore.repo'
import CredentialModel from '@src/models/credential.model'
import { BadRequestResponse, ConflictResponse } from '@src/core/error.responses'
import { CreatedResponse, OkResponse } from '@src/core/success.responses'
import CartModel from '@src/models/cart.model'
import { EVerifyType } from '@src/models/otpKey.model'
import OtpKeyRepo from '@src/models/repositories/registerOtp.repo'
import mongoose from 'mongoose'
import { InternalServerError } from '@src/core/exceptions'

class UserServices {
  static RequestVerifyEmail = async function (email: string) {
    /**
     * @description 1. kiểm tra email đang được user nào sử dụng chưa
     */
    const existingUser = await UserRepo.FindByEmail(email)

    if (existingUser && existingUser.IsVerified) {
      return new ConflictResponse('email is already in use. Please use another email!')
    }

    /**
     * @description 2. kiểm tra đã tồn tại yêu cầu xác thức trước đó chưa
     *                2.1. chưa - tạo và lưu otp mới cho email
     *                2.2. rồi - update otp mới cho email
     */
    let newOtp = null

    const existingRequest = await OtpKeyRepo.FindByEmail(email)
    if (!existingRequest) {
      const registerOtp = await OtpKeyRepo.Create(EVerifyType.Email, email)
      newOtp = registerOtp.GenerateOtp()
      registerOtp.save()
    } else {
      newOtp = existingRequest.GenerateOtp()
      existingRequest.save()
    }

    /**
     * @description 3. gửi mail
     */

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
  }

  static VerifyEmail = async function (email: string, candidateOtp: string) {
    /**
     * @description 1. kiểm tra có tồn tại yêu cầu xác thực cho email hiện tại hay không
     */
    const existingValidOtp = await OtpKeyRepo.FindValidByEmail(email)
    if (!existingValidOtp) {
      return new BadRequestResponse('email or otp is not valid')
    }

    /**
     * @description 2. kiểm tra otp có hợp lệ hay không
     */
    if (await existingValidOtp.ValidateOtp(candidateOtp)) {
      existingValidOtp.CurrentOtp = null
      existingValidOtp.IsVerified = true

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
    const isValidEmail = await OtpKeyRepo.IsValidEmail(input.email)

    if (!isValidEmail) {
      return new BadRequestResponse('email is not verified')
    }

    /**
     * @description 2. kiểm tra email đã tồn tại chưa
     */
    const existingUser = await UserRepo.FindByEmail(input.email)
    if (existingUser) {
      return new BadRequestResponse('email is already in use. Please use another email!')
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      /**
       * @description 3. tạo thông tin ban đầu cho user
       */
      const newUser = await UserModel.create({
        Email: input.email,
        FirstName: input.firstName,
        LastName: input.lastName,
        MobilePhone: input.mobilePhone
      })

      /**
       * @description 4. tạo thông tin đăng nhập
       */
      const authCredential = await CredentialModel.create({
        User: newUser._id,
        CredLogin: input.email,
        CredPassword: input.credPassword
      })

      /**
       * @description 5. tạo key store
       */
      await KeyStoreRepo.Create(String(authCredential._id))

      throw new InternalServerError()

      /**
       * @description 6. tạo thông tin giỏ hàng
       */
      await CartModel.create({
        Buyer: newUser._id
      })

      await session.commitTransaction();

    } catch (error) {
      await session.abortTransaction();
    } finally {
      session.endSession(); 
    }

    return new CreatedResponse({
      email: input.email,
      messsage: 'create user successfull'
    })
  }
}

export default UserServices
