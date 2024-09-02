const express = require('express')
const { upload } = require('../middleware/multerMiddleware')
const { createProduct, getAllProdcuts, deleteProduct, getAllShopProdcuts, createReview } = require('../controller/productControllers')
const router = express.Router()

const { verifyJWT } = require('../middleware/authMiddleware')


// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to Product route" })
})

// Create product
router.post('/create-product', upload.array('images'), createProduct)
// Get all products
router.get('/get-all-products-shop/:id', getAllShopProdcuts)
// Get all products
router.get('/get-all-products', getAllProdcuts)
// Delete product
router.delete('/delete-shop-product/:id', deleteProduct)
// Add review of product
router.put('/create-new-review', verifyJWT, createReview)



module.exports = router