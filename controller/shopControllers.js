const asyncHandler = require("express-async-handler");
const shopModel = require("../model/shopModel");
const { HashPassword } = require("../utils/HashPassword");
const { sendMail } = require("../utils/SendMail");
const path = require("path");
const fs = require("fs")
const jwt = require("jsonwebtoken");
const sendToken = require("../utils/jwtToken");
const sendShopToken = require("../utils/shopToken");

const registerShop = asyncHandler(async (req, res) => {
    try {
        const { email, name, password, phoneNumber, zipCode, address } = req.body
        // console.log("data",email,name,password,phoneNumber,zipCode,address);
        const findShop = await shopModel.findOne({ email: email });
        if (findShop) {
            console.log(" Shop already exsist =>", existingUser);
            const filename = req.file.filename;
            const filePath = `${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error Deleting file", err);
                    return res.status(500).json({ message: "Error deleting file" })
                }
            })
            return res.status(409).json({ message: "Shop against the given email already exists" });
        }
        const hashPassword = await HashPassword(password);
        const filename = req.file.filename;
        const fileUrl = path.join(filename);

        const newSeller = {
            name,
            email,
            password: hashPassword,
            avatar: fileUrl,
            phoneNumber,
            zipCode,
            address,
        };
        const activationToken = createActivationToken(newSeller);
        // return console.log("new seller ", activationToken);
        const activationUrl = `https://online-e-shop.vercel.app/shop/activation/${activationToken}`;

        const options = {
            email: newSeller.email,
            subject: "Activate your Shop",
            text: `Hello ${newSeller.name} Please click on the link to activate your Shop: ${activationUrl}`
        }
        try {
            sendMail(options)
            res.status(201).json({ message: `Please check your email : ${newSeller.email} to Activate your Shop` })
        } catch (error) {
            console.log("error at activation", error);
            return res.status(400).json({ message: "Somthing went wrong at activation Shop" })
        }

    } catch (error) {
        res.status(500).json({ message: "Somthing went wrong!" })
    }
})

// Login controller for shop
const loginShop = asyncHandler(async (req, res) => {

    try {
        // collect data from req.body
        // username and email
        // check user is exist
        // check password is correct
        // generate access and refresh token
        // send cookie
        const { email, password } = req.body
        // console.log("cridential for user login ", email, password);
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all inputs" })
        }


        const shopData = await shopModel.findOne({ email: email })
        // console.log("filter user ", shopData);

        if (!shopData) {
            return res.status(400).json({ message: "Shop does not exist" })
        }

        const isPasswordValid = await shopData.isPasswordCorrect(password)


        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password is not matched" })
        }

        // console.log("ispassword ,", isPasswordValid);

        await sendShopToken(shopData, res)

        // return res.status(200)
        //     .cookie("accessToken", accessToken, options)
        //     .cookie("refreshToken", refreshToken, options)
        //     .json({ data: { logedInUser, accessToken, refreshToken }, message: "User logedIn Successfully" })

    } catch (error) {
        return res.status(500).json({ message: "Server error" })
    }
})

// activation token genrator
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, { expiresIn: '5m' })
};
// activate new user
const activateNewSeller = async (req, res) => {
    try {
        const { activation_token } = req.body;
        const newSeller = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
        // console.log("here in activation new user", newSeller);
        if (!newSeller) {
            return res.status(400).json({ message: "Invalid Token" })
        }
        const { email, name, password, avatar } = newSeller;

        let findShop = await shopModel.findOne({ email: email })
        // console.log("Find exists user ", findUser);
        if (findShop) {
            return res.status(400).json({ message: "Shop already exists" })
        }
        shop = await shopModel.create(newSeller)
        // console.log("new user created ",user);

        sendToken(shop, res)

    } catch (error) {
        console.log("Error at activation New Shop", error);
    }

}

// logout user
const logoutSeller = async (req, res) => {
    try {
        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        })
        res.status(200).json({ message: "Log out successfully" })
    } catch (error) {
        console.log("Error at logout");
    }
}



module.exports = {
    registerShop,
    loginShop,
    activateNewSeller,
    logoutSeller
};