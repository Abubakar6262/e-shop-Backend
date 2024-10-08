const express = require("express")
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path');

// Middleware to parse JSON
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: 'https://online-e-shop.vercel.app', // specify the allowed origin
    credentials: true, // allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use("/", express.static("uploads"));

// app.use('/', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));




// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    });
}


module.exports = app;