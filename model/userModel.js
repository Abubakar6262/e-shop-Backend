const mongoose = require("mongoose")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
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
        phoneNumber: {
            type: Number,
        },
        addresses: [
            {
                country: {
                    type: String,
                },
                state: {
                    type: String,
                },
                city: {
                    type: String,
                },
                address1: {
                    type: String,
                },
                address2: {
                    type: String,
                },
                zipCode: {
                    type: Number,
                },
                addressType: {
                    type: String,
                },
            }
        ],
        avatar: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};


userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "2d"
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "2d"
        }
    );
};

// Add getJwtToken method
userSchema.methods.getJwtToken = function () {
    return jwt.sign({
        id: this._id,
    },
        process.env.JWT_SECRET,
        {
            expiresIn: "5d",
        }
    );
};


// userSchema.methods.ispasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)

// }


// userSchema.methods.genrateAccessToken = function () {
//     return jwt.sign({
//         _id: this._id,
//         email: this.email,
//         username: this.username,
//         fullname: this.fullname
//     },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: "2d"
//         }
//     )
// }
// userSchema.methods.genrateRegreshToken = function () {
//     return jwt.sign({
//         _id: this._id,
//     },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: "2d"
//         }
//     )
// }


module.exports = mongoose.model('users', userSchema)