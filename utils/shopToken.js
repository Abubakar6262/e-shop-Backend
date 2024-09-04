const sendShopToken = (user, res) => {
    const token = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
    };

    return res.status(200)
        .cookie("seller_token", token, options)
        .json({ user, token, message: "User activated successfully" });
};

module.exports = sendShopToken;
