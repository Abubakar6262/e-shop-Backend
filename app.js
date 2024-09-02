const express = require("express")
const app = express()
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// Middleware to parse JSON
app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', // specify the allowed origin
    credentials: true, // allow credentials (cookies, authorization headers, etc.)
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

app.use("/", express.static("uploads"));

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));




// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "config/.env"
    });
}


module.exports = app;