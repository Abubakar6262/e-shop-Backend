const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");

const createPayment = asyncHandler(async (req, res) => {
    try {
        const { amount } = req.body;
        const myPayment = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                company: "AbubakarCodex",
            },
        })

        return res.status(200).json({ message: "payment done! successfully", client_secret: myPayment.client_secret })
    } catch (error) {
        console.log("error at creating payment");
        return res.status(500).json({ message: "somthing went wrong at creating payment || server issue", error })

    }
})


module.exports = {
    createPayment,
};