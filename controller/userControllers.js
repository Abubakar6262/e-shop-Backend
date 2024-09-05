const asyncHandler = require("express-async-handler");
const { HashPassword } = require("../utils/HashPassword");
const userModel = require("../model/userModel");
const path = require("path");
const fs = require("fs")
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/SendMail");
const sendToken = require("../utils/jwtToken");

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
        console.log("User already exists:", existingUser);

        // Delete the uploaded file if the user already exists
        if (req.file) {
            const filePath = `./uploads/${req.file.filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error deleting file:", err);
                    return res.status(500).json({ message: "Error deleting file" });
                }
            });
        }

        return res.status(409).json({ message: "User with the given email already exists" });
    }

    // Hash the password
    const hashPassword = await HashPassword(password);

    // Check if the file is uploaded
    let fileUrl = null;
    if (req.file) {
        fileUrl = path.join(req.file.filename);
        console.log("Uploaded file URL:", fileUrl);
    }

    // Create the user object
    const newUser = {
        name,
        email,
        password: hashPassword,
        avatar: fileUrl
    };

    console.log("New user:", newUser);

    // Generate activation token
    const activationToken = createActivationToken(newUser);
    console.log("Activation token:", activationToken);

    // Send activation email
    const activationUrl = `https://online-e-shop.vercel.app/activation/${activationToken}`;
    const options = {
        email: newUser.email,
        subject: "Activate your account",
        text: `Hello ${newUser.name}, Please click on the link to activate your account: ${activationUrl}`
    };

    try {
        await sendMail(options);
        res.status(201).json({ message: `Please check your email: ${newUser.email} to activate your account` });
    } catch (error) {
        console.log("Error at activation:", error);
        return res.status(500).json({ message: "Something went wrong at account activation" });
    }
});


const loginUser = asyncHandler(async (req, res) => {
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


        const userData = await userModel.findOne({ email })
        // console.log("filter user ", userData);

        if (!userData) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const isPasswordValid = await userData.isPasswordCorrect(password)


        if (!isPasswordValid) {
            return res.status(400).json({ message: "Password is not matched" })
        }

        // console.log("ispassword ,", isPasswordValid);

        await sendToken(userData, res)

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
const activateNewUser = async (req, res) => {
    try {
        const { activation_token } = req.body;
        
        // Verify the activation token
        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET, (err, decoded) => {
            if (err) {
                // Check for token expiration
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired" });
                }
                return res.status(400).json({ message: "Invalid Token" });
            }
            return decoded;
        });
        
        if (!newUser) {
            return res.status(400).json({ message: "Invalid Token" });
        }

        const { email, name, password, avatar } = newUser;

        let findUser = await userModel.findOne({ email });
        if (findUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await userModel.create(newUser);
        sendToken(user, res);

    } catch (error) {
        console.log("Error at activation New User", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

// logout user
const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {  // Clear the user token
            expires: new Date(Date.now()),  // Expire immediately
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',  // Secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',  // Ensure the path matches the path used when setting the cookie
        });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error during user logout", error);
        res.status(500).json({ message: "Logout failed" });
    }
};

// Update user profile Data
const updateUserProfile = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Find the user by email
        const findUser = await userModel.findOne({ email: email });
        if (!findUser) {
            return res.status(400).json({ message: "User does not exist at that email" });
        }

        // Hash the new password
        const hashPassword = await HashPassword(password);

        findUser.name = name;
        findUser.email = email;
        findUser.password = hashPassword;
        findUser.phoneNumber = phoneNumber;
        findUser.updatedAt = new Date();

        const updatedUser = await findUser.save();

        return res.status(200).json({ message: "User is Updated", updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Something went wrong || Server issue" });
    }
}
// Update user profile Image
const updateProfileImage = async (req, res) => {
    try {
        // console.log("user data in update avater ", req.user);
        const findUser = await userModel.findOne(req.user._id)
        const findPreAvatarPath = `uploads/${findUser.avatar}`
        await fs.unlinkSync(findPreAvatarPath);

        const fileUrl = path.join(req.file.filename)

        const user = await userModel.findByIdAndUpdate(req.user.id, { avatar: fileUrl })

        return res.status(200).json({ message: "user Profile image updated successfully", user })

    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at update profile || server issue" })
    }
}

// update user profile addresses
const updateProfileAddresses = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req?.user?._id })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressData = req.body;

        if (!addressData || Object.keys(addressData).length === 0) {
            return res.status(400).json({ message: "Address data is required" });
        }

        const { addressType } = addressData;

        // Check if addressType already exists in user addresses
        const addressTypeExists = user.addresses.some(address => address.addressType === addressType);

        if (addressTypeExists) {
            return res.status(400).json({ message: `Address type '${addressType}' already exists` });
        }

        user.addresses = user.addresses || [];
        user.addresses.push(addressData);
        user.updatedAt = new Date();

        const updateUser = await user.save();
        // console.log("user data is ", updateUser);

        return res.status(200).json({ message: "Addresses updated successfully", user: updateUser });

    } catch (error) {
        console.log("Error at updating addresses:", error);

        return res.status(500).json({ message: "Something went wrong while updating addresses || server issue" });
    }

}

const deleteUserAddress = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req?.user?._id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { addressId } = req.body;



        if (!addressId) {
            return res.status(400).json({ message: "Address ID is required" });
        }

        // Check if the address with the given ID exists in the user's addresses
        const addressExists = user.addresses.some(address => address._id.toString() === addressId);

        if (!addressExists) {
            return res.status(404).json({ message: `Address with ID '${addressId}' not found` });
        }

        // Filter out the address with the given ID
        user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);

        // Save the updated user data
        const updatedUser = await user.save();
        // console.log("Updated user data: ", updatedUser);

        return res.status(200).json({ message: "Address deleted successfully", user: updatedUser });

    } catch (error) {
        console.log("Error at deleting address:", error);

        return res.status(500).json({ message: "Something went wrong while deleting address || server issue" });
    }
}
module.exports = {
    registerUser,
    activateNewUser,
    loginUser,
    logoutUser,
    updateUserProfile,
    updateProfileImage,
    updateProfileAddresses,
    deleteUserAddress,
};
