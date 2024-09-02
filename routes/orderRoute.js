const express = require('express')
const { createOrder, updateOrderStatus, refundNow, refundSuccess } = require('../controller/orderController')
const orderModel = require('../model/orderModel')
const { verifyJWT_seller } = require('../middleware/authMiddleware')
const router = express.Router()


// For get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to Order route" })
})
// Route for create-order  request
router.post('/create-order', createOrder)

// Route for get all order of user
router.get('/get-all-orders/:userId', async (req, res) => {
    try {
        const orders = await orderModel.find({ "user._id": req.params.userId }).sort({ createdAt: -1 })

        return res.status(200).json({ message: "Order getted successfully", orders })
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at getting all orders || server issue", error })
    }
})

// Route for get all orders of seller
router.get('/get-all-seller-orders/:shopId', async (req, res) => {
    try {
        const orders = await orderModel.find({ "cart.shopId": req.params.shopId }).sort({ createdAt: -1 })

        return res.status(200).json({ message: "Order getted successfully", orders })
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at getting all orders || server issue", error })
    }
})

router.put('/update-order-status/:id', verifyJWT_seller, updateOrderStatus)

// Route for refund
router.put('/order-refund/:id', refundNow)

// refund order ----- seller
router.put('/order-refund-success/:id', verifyJWT_seller,refundSuccess)




module.exports = router