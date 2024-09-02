const express = require('express')
const { upload } = require('../middleware/multerMiddleware')
const { createEvent, getAllEvents, deleteEvent } = require('../controller/eventControllers')
const eventModel = require('../model/eventModel')
const router = express.Router()


// for get request
router.get('/', (req, res) => {

    res.status(200).json({ message: "welcome to Product Event route" })
})

// Create product
router.post('/create-event', upload.array('images'), createEvent)
// Get all events of shop
router.get('/get-all-events-shop/:id', getAllEvents)
// get all events
router.get('/get-all-events', async (req, res) => {
    try {
        const allevents = await eventModel.find();

        res.status(200).json({ message: "All events", allevents })
    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong! || all getting all events" })
    }
})
// // Delete product
router.delete('/delete-shop-event/:id', deleteEvent)



module.exports = router