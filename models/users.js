// models/User.js
const mongoose = require("mongoose");
const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    portfolio: [
        {
            stockId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stock"
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
});

userSchema.plugin(plm)
module.exports = mongoose.model("User", userSchema);
