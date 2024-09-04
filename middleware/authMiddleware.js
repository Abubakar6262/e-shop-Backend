const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: "Unauthorized request" });
        }

        const decodedToken = await jwt.verify(token.trim(), process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.id).select("-password");

        if (!user) {
            return res.status(400).json({ message: "Invalid token || User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token || Some issue occurred" });
    }
});

const verifyJWT_seller = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.seller_token;
        if (!token) {
            return res.status(400).json({ message: "Unauthorized request" });
        }

        const decodedToken = await jwt.verify(token.trim(), process.env.JWT_SECRET);
        const user = await shopModel.findById(decodedToken.id).select("-password");

        if (!user) {
            return res.status(400).json({ message: "Invalid token || User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(400).json({ message: "Invalid token || Some issue occurred" });
    }
});

module.exports = {
    verifyJWT,
    verifyJWT_seller
};
