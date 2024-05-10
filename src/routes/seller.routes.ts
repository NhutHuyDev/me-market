import SellerControllers from '@src/controllers/seller.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import { ESystemRoles } from '@src/models/role.model'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([ESystemRoles.Buyer])))
router.post('/register', HandleException(SellerControllers.RegisterHandler))

export default router
