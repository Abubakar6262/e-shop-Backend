const mongoose = require("mongoose")
const jwt =require('jsonwebtoken')
const bcrypt = require("bcryptjs")

const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
        },
        zipCode: {
            type: Number,
            require: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        avatar: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
    },
    {
        timestamps: true,
    }
)

// Password check
shopSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Add getJwtToken method
shopSchema.methods.getJwtToken = function () {
    return jwt.sign({
        id: this._id,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: "5d",
        }
    );
};
module.exports = mongoose.model('shops', shopSchema)