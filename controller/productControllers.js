const asyncHandler = require("express-async-handler");
const shopModel = require("../model/shopModel");
const productModel = require("../model/productModel");
const fs = require("fs");
const orderModel = require("../model/orderModel");


const createProduct = asyncHandler(async (req, res) => {
    try {
        const { shopId } = req.body;
        // console.log("shop id =>", shopId);
        const shop = await shopModel.findById(shopId);
        // console.log("shop data =>", shop);
        if (!shop) {
            return res.status(400).json({ message: "Invalid shop id" })
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const productData = req.body;
            productData.images = imageUrls
            productData.shop = shop;

            const product = await productModel.create(productData)
            // console.log("Product created ", product);

            return res.status(200).json({ product, message: "Product Create successfully!" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wron!" })
    }
})
const getAllShopProdcuts = asyncHandler(async (req, res) => {
    // console.log("controller in getallprodcuts ");

    try {
        const products = await productModel.find({ shopId: req.params.id });

        res.status(200).json({ message: "All Products of that shop", products })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all products" })
    }
})
const getAllProdcuts = asyncHandler(async (req, res) => {
    // console.log("controller in getallprodcuts ");

    try {
        const products = await productModel.find();

        res.status(200).json({ message: "All Products of that shop", products })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all products" })
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findByIdAndDelete(productId);
        if (!product) {
            return res.status(400).json({ message: "Product Not found against this ID!" });
        }
        //delete file also
        product.images.forEach((image) => {
            const filename = image
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error Deleting file", err);
                    return res.status(500).json({ message: "Error deleting file" })
                }
            })

        })

        res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all products" })
    }
})

const createReview = asyncHandler(async (req, res) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;

        const product = await productModel.findById(productId);

        const review = {
            user, rating, comment, productId
        }


        const isReviewed = product.reviews.find((rew) => rew.user._id === user._id)

        if (isReviewed) {
            product.reviews.forEach((rew) => {
                if (rew.user._id === user._id) {
                    (rew.rating = rating), (rew.comment = comment), (rew.user = user)
                }
            })
        } else {
            product.reviews.push(review)
        }

        let avg = 0;
        product.reviews.forEach((rew) => {
            avg += rew.rating;
        })


        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false })

        await orderModel.findByIdAndUpdate(orderId, { $set: { "cart.$[elem].isReviewed": true } }, { arrayFilters: [{ "elem._id": productId }], new: true })

        return res.status(200).json({ message: "Thanks for Your Review", product })

    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at creating review || server issue" })
    }
})

module.exports = {
    createProduct,
    getAllProdcuts,
    deleteProduct,
    getAllShopProdcuts,
    createReview,
};
