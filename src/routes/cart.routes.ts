import CartControllers from '@src/controllers/cart.controllers'
import SellerControllers from '@src/controllers/seller.controllers'
import HandleException from '@src/helpers/handleException'
import RequireRoles from '@src/middlewares/requireRoles'
import { SystemRoles } from '@src/models/role.model'
import express from 'express'

const router = express.Router()

router.use(HandleException(RequireRoles([SystemRoles.Customer])))
router.get('/', HandleException(CartControllers.FindCart))
router.post('/', HandleException(CartControllers.AddToCart))

export default router
