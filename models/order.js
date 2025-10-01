const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: "Stock", required: true },
    stockName: String,
    quantity: Number,
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
});


module.exports = mongoose.model("Order", orderSchema);
