import ordersRouter from './orders.js'
import authRouter from './users.js'
import productsRouter from './products.js'
import { Router } from 'express'
import passport from 'passport'
const router = Router()

router.use('/orders', ordersRouter)
router.use('/products', productsRouter)
router.use('/auth', authRouter)

export default router;
