// server/models/Order.js

const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    ],
    total: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    paymentIntentId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending","shipped","delivered"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid",
    },
});

module.exports = mongoose.model('Order', OrderSchema);