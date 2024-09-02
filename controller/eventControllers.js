const asyncHandler = require("express-async-handler");
const eventModel = require("../model/eventModel");
const shopModel = require("../model/shopModel");
const fs = require("fs")



const createEvent = asyncHandler(async (req, res) => {
    try {
        const { shopId } = req.body;
        // console.log("shop id =>", shopId);
        const shop = await shopModel.findById(shopId);
        // console.log("shop data =>", shop);
        if (!shop) {
            return res.status(400).json({ message: "Invalid shop id" })
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const eventData = req.body;
            eventData.images = imageUrls
            eventData.shop = shop;

            const event = await eventModel.create(eventData)
            // console.log("event created ", event);

            return res.status(200).json({ event, message: "Event Created successfully!" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong!" })
    }
})

const getAllEvents = asyncHandler(async (req, res) => {
    // console.log("controller in getallprodcuts ");

    try {
        const events = await eventModel.find({ shopId: req.params.id });

        res.status(200).json({ message: "All Products of that shop", events })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all products" })
    }
})

const deleteEvent = asyncHandler(async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventModel.findByIdAndDelete(eventId);
        if (!event) {
            return res.status(400).json({ message: "event Not found against this ID!" });
        }
        // console.log("event data =>" ,event);
        
        //delete file also
        event.images.forEach((image) => {
            const filename = image
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error Deleting file", err);
                    return res.status(500).json({ message: "Error deleting file" })
                }
            })

        })
        res.status(200).json({ message: "event deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all events" })
    }
})

module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
};
