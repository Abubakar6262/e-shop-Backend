const express = require('express')
const { upload } = require('../middleware/multerMiddleware')
const { registerUser, activateNewUser, loginUser, logoutUser, updateUserProfile, updateProfileImage, updateProfileAddresses, deleteUserAddress } = require('../controller/userControllers')
const { verifyJWT } = require('../middleware/authMiddleware')
const userModel = require('../model/userModel')
const { route } = require('../app')
const router = express.Router()


// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to user route" })
})
// for get request
router.get('/getuser', verifyJWT, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (!user) {
            return res.status(400).json({ message: "User does not exists" })

        }
        return res.status(200).json({ message: "user accessed", user })
    } catch (error) {
        return res.status(500).json({ message: "Server Error" })
    }
})

// for Register User
router.post('/register', upload.single("avatar"), registerUser)

// Activation new user
router.post('/activation', activateNewUser);

// for login user
router.post('/login', loginUser);

// router.post('/login', loginUser)

// // logOut user
router.get('/logout', verifyJWT, logoutUser)

// Update user profile

router.post("/update-user-profile", updateUserProfile)

// update profile image
router.post('/update-avatar', verifyJWT, upload.single('avatar'), updateProfileImage)

// update profile address
router.post('/update-address', verifyJWT, updateProfileAddresses)

// delete profile address
router.delete('/delete-address', verifyJWT, deleteUserAddress)

module.exports = router