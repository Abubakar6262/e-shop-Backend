const app = require("./app");
const { activateNewUser } = require("./controller/userControllers");
const connectDB = require("./db/Database");
const userRoute = require('./routes/userRoutes')
const shopRoute = require('./routes/shopRoute')
const productRoute = require('./routes/productRoutes')
const EventRoute = require('./routes/eventRoutes')
const CoupounRoute = require('./routes/coupounCodeRoute')
const PaymentRoute = require('./routes/paymentRoute')
const OrderRoute = require('./routes/orderRoute')

const PORT = process.env.PORT || 3000;

//  Handeling uncaught Exception
process.on("uncaughtException", err => {
    console.log("Error", err.message);
    console.log("Shutting down the server for uncaught exception");
})


// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config(
        {
            path: "config/.env"
        }
    );
}

// connect DB
connectDB();



// create server
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running at http://localhost:${process.env.PORT}`);
})


// unhandle promises rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`Shutting down the server for unhandle promises rejection`);
    server.close(() => {
        process.exit(1);
    })
})


app.get('/', (req, res) => {
    res.status(200).json({ message: `Welcome to server That is running on ${PORT} port` })
})

// route for user
app.use('/api/v1/users', userRoute)
// Shop Route
app.use('/api/v1/shop', shopRoute)
// Shop product Route
app.use('/api/v1/product', productRoute)
// Events Route
app.use('/api/v1/event', EventRoute)
// Coupouns Route
app.use('/api/v1/coupoun', CoupounRoute)
// Payment Route
app.use('/api/v1/payment', PaymentRoute)
// Order Route
app.use('/api/v1/order', OrderRoute)

