const mongoose = require("mongoose")
// const jwt = require('jsonwebtoken')
// const bcrypt = require("bcryptjs")

const productSchema = new mongoose.Schema(
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
        reviews: [
            {
                user: {
                    type: Object,
                },
                rating: {
                    type: Number,
                },
                comment: {
                    type: String,
                },
                productId: {
                    type: String,
                },
            }
        ],
        ratings: {
            type: Number,
        },
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

// // Password check
// shopSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

// // Add getJwtToken method
// shopSchema.methods.getJwtToken = function () {
//     return jwt.sign({
//         id: this._id,
//     },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "5d",
//         }
//     );
// };
module.exports = mongoose.model('products', productSchema)