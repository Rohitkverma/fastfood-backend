const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;

    // Ensure the email field is present
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required" });
    }

    // Add order date at the beginning of order_data array
    data.splice(0, 0, { Order_date: req.body.order_date });
    console.log("Request email:", req.body.email);

    try {
        // Check if email exists in the database
        let existingOrder = await Order.findOne({ email: req.body.email });
        console.log("Existing order:", existingOrder);

        if (!existingOrder) {
            // If email does not exist, create a new order
            console.log("Creating new order for:", req.body.email);
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {
            // If email exists, update the existing order
            console.log("Updating order for:", req.body.email);
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        }
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).send({ error: "Server Error", message: error.message });
    }
});


// Get order data form the database
router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});
module.exports = router;
