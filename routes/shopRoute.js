const express = require('express')
const { upload } = require('../middleware/multerMiddleware')
const { verifyJWT, verifyJWT_seller } = require('../middleware/authMiddleware')

const { registerShop, activateNewSeller, loginShop, logoutSeller } = require('../controller/shopControllers')
const shopModel = require('../model/shopModel')
const router = express.Router()


// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to seller shop" })
})

// for get request
router.get('/getseller', verifyJWT_seller, async (req, res) => {
    try {
        const seller = await shopModel.findById(req.user._id)
        if (!seller) {
            return res.status(400).json({ message: "seller does not exists" })

        }
        return res.status(200).json({ message: "seller accessed", seller })
    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }
})

// Login shop
router.post('/login', loginShop);

// Create Shop
router.post('/create', upload.single("avatar"), registerShop)

// Activate shop
router.post('/activation', activateNewSeller);

// logOut seller
router.get('/logout', verifyJWT_seller, logoutSeller)

module.exports = router