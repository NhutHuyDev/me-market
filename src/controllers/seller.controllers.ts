import { IUser } from '@src/models/user.model'
import SellerServices from '@src/services/seller.services'
import customHttpHeaders from '@src/utils/customHttpHeaders'
import { Request, Response } from 'express'

class SellerControllers {
  static RegisterHandler = async function (req: Request, res: Response) {
    const clientId = req.headers[customHttpHeaders.CLIENT_ID] as string

    const response = await SellerServices.Register(clientId)
    response.Send(res)
  }
}

export default SellerControllers
