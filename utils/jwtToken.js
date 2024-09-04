// create Token and saving that in cookies

const sendToken = (user, res) => {
    const token = user.getJwtToken();

    // options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        httpOnly: true,

        // Change after deployment
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
    };
    // console.log("token after user send ", token);
    return res.status(200)
        .cookie("token", token, options)
        .json({ user, token, message: "User activated successfully" });
};

module.exports = sendToken;
