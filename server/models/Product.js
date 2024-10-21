// server/models/Products.js

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        required: true
    },
    image: {
        type: String, // Assuming you store the URL or file path of the image
        required: true,
    }
    
});

module.exports = mongoose.model('Product', ProductSchema);