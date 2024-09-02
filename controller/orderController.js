const asyncHandler = require("express-async-handler");
const orderModel = require('../model/orderModel')
const productModel = require('../model/productModel')

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

        // Group cart items by shopId
        const shopItemMap = new Map();
        for (const item of cart) {
            const shopId = item?.shopId;
            if (!shopItemMap.has(shopId)) {
                shopItemMap.set(shopId, []);
            }
            shopItemMap.get(shopId).push(item);
        }
        // create an order for each shop
        const orders = [];
        for (const [shopId, items] of shopItemMap) {
            const order = await orderModel.create({ cart: items, shippingAddress, user, totalPrice, paymentInfo })
            orders.push(order);
        }

        return res.status(200).json({ message: "order completed successfully", orders })
    }
    catch (error) {
        return res.status(500).json({ message: "Somthing went wrong!" })
    }
})

// update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(400).json({ message: "Order not found at that id" })
        }
        if (req.body.status === "Transferred to delivery partner") {
            order.cart.forEach(async (o) => {
                await updateorder(o._id, o.qty);
            })
        }

        order.status = req.body.status;
        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
            order.paymentInfo.status = "Succeeded";
        }

        await order.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "order staus updated successfully", order })

        // this is update function for product order
        async function updateorder(id, qty) {
            const product = await productModel.findById(id)
            product.stock -= qty;
            product.sold_out += qty;

            await product.save({ validateBeforeSave: false })
        }

    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at update order status || server issue", error })
    }
})

//  refund order ---- user
const refundNow = asyncHandler(async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(400).json({ message: "Order not found at that id" })
        }

        order.status = req.body.status;

        await order.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "order refund request successfully", order })

    } catch (error) {
        return res.status(500).json({ message: "Somthing went wrong at update order status || server issue", error })
    }
})


// refund order ----- seller
const refundSuccess = asyncHandler(async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id)
        if (!order) {
            return res.status(400).json({ message: "Order not found against this id" })
        }
        order.status = req.body.status;

        if (req.body.status === "Refund Success") {
            order.cart.forEach(async (o) => {
                await updateorder(o._id, o.qty);
            })
        }


        // this is update function for product order
        async function updateorder(id, qty) {
            const product = await productModel.findById(id)
            product.stock += qty;
            product.sold_out -= qty;

            await product.save({ validateBeforeSave: false })
        }

        await order.save();
        return res.status(200).json({ message: "Order refund successfully" })

    } catch (error) {
        return res.status(500).json({ message: "somthing went wrong at refund success || server error", error })
    }
})

module.exports = {
    createOrder,
    updateOrderStatus,
    refundNow,
    refundSuccess,
};
