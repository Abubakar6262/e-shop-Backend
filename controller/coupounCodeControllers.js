const asyncHandler = require("express-async-handler");
const coupounCodeModel = require("../model/coupounCodeModel");

const createCoupoun = asyncHandler(async (req, res) => {
    try {
        const isCoupounCode = await coupounCodeModel.find({ name: req.body.name });

        if (isCoupounCode.length !== 0) {
            return res.status(400).json({ message: "Coupoun Code already exists" });
        }

        const coupounCode = coupounCodeModel.create(req.body);
        return res.status(200).json({ message: "Coupoun code created successfully", coupounCode })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong at create coupoun" })
    }
})


const getAllCoupounCodes = asyncHandler(async (req, res) => {
    try {
        const coupounCodes = await coupounCodeModel.find({ 'shop._id': req.params.id })
        // console.log("coupouns are ", coupounCodes);

        return res.status(200).json({ message: "All coupounCodes ", coupounCodes })
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at getting all coupoun codes" })
    }
})
const getAllCoupounCodesByName = asyncHandler(async (req, res) => {
    try {
        const couponCode = await coupounCodeModel.findOne({ name: req.params.name })
        // console.log("coupouns are ", coupounCodes);

        return res.status(200).json({ message: "All coupounCodes ", couponCode })
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at getting all coupoun codes" })
    }
})
module.exports = {
    createCoupoun,
    getAllCoupounCodes,
    getAllCoupounCodesByName,
}

