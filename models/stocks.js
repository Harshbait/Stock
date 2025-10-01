const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 10 }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
});

module.exports = mongoose.model("Stock", stockSchema);