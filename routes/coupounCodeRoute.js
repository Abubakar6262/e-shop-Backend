const express = require('express')
const { createCoupoun, getAllCoupounCodes, getAllCoupounCodesByName } = require('../controller/coupounCodeControllers')

const router = express.Router()

// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to coupoun route" })
})

// for post request
router.post('/create-coupoun-code', createCoupoun)

// for get request
router.get('/get-coupoun-code/:id', getAllCoupounCodes)

// for get request
router.get('/get-coupon-value/:name', getAllCoupounCodesByName)


module.exports = router