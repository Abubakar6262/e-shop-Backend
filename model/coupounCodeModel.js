const mongoose = require("mongoose")

const coupounCodeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        value: {
            type: Number,
            require: true,
        },
        minAmmount: {
            type: Number,
        },
        maxAmmount: {
            type: Number,
        },
        selectedProduct: {
            type: String,
            require: true,
        },
        shop: {
            type: Object,
            require: true,
        },
        createAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    }
)
module.exports = mongoose.model('coupouncodes', coupounCodeSchema)