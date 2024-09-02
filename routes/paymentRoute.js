const express = require('express')
const { createPayment } = require('../controller/paymentController')
const router = express.Router()


// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to Payment route" })
})

// create payment route
router.post('/process', createPayment)

// get stripe api
router.get('/stripeapikey', async (req, res) => {
    res.status(200).json({ message: "api getted successfully ", stripeapikey: process.env.STRIPE_API_KEY })
})



module.exports = router