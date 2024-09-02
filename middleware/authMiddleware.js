const asyncHandler = require('express-async-handler')
const jwt = require("jsonwebtoken");
const userModel = require('../model/userModel');
const shopModel = require('../model/shopModel');
// const userModel = require("../models/userModels")

// check for user token
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // console.log("In try block of authentication middleware ");
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        const token = req.cookies.token;
        // console.log("Token in try block", token.trim());
        if (!token) {
            return res.status(400).json({ message: "UnAuthorize request" })
        }
        // console.log("after token check");

        const decodedToken = await jwt.verify(token.trim(), process.env.JWT_SECRET)
        // console.log("decodedToken ==>", decodedToken);

        const user = await userModel.findById(decodedToken?.id).select("-password")
        // console.log("user from token ", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid accss to Token || user not fount" })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(400).json({ message: "Invalid accss to Token || some issue" })
        // throw new ApiError(400, "Invalid access token", error)
    }
})

// Check for seller token 
const verifyJWT_seller = asyncHandler(async (req, res, next) => {
    try {
        // console.log("In try block of authentication middleware ");
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
        const token = req.cookies.seller_token;
        // console.log("Token in try block", token.trim());
        if (!token) {
            return res.status(400).json({ message: "UnAuthorize request" })
        }
        // console.log("after token check");

        const decodedToken = await jwt.verify(token.trim(), process.env.JWT_SECRET)
        // console.log("decodedToken ==>", decodedToken);

        const user = await shopModel.findById(decodedToken?.id).select("-password")
        // console.log("user from token ", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid accss to Token || user not fount" })
        }

        req.user = user;
        next()
    } catch (error) {
        return res.status(400).json({ message: "Invalid accss to Token || some issue" })
        // throw new ApiError(400, "Invalid access token", error)
    }
})

module.exports = {
    verifyJWT,
    verifyJWT_seller
}