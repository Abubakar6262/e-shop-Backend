const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        category: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },

        start_Date: {
            type: Date,
            require: true,
        },
        finish_Date: {
            type: Date,
            require: true,
        },
        status: {
            type:String,
            default:"Running"
        },

        tags: {
            type: String,
            require: true,
        },
        originalPrice: {
            type: Number,
        },
        discountPrice: {
            type: Number,
            require: true,
        },
        stock: {
            type: Number,
            require: true,
        },

        images: [
            {
                type: String,
            }
        ],
        shopId: {
            type: String,
            require: true,
        },
        shop: {
            type: Object,
            require: true,
        },
        sold_out: {
            type: Number,
            default: 0,
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
module.exports = mongoose.model('events', eventSchema)