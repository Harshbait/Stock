const mongoose = require("mongoose");
const Stock = require("../models/stocks");
const initData = require('./data')

const MONGO_URL = "mongodb://127.0.0.1:27017/stockExchange"

main().then(() => {
    console.log('Connected to DB')
}).catch((e) => console.log(`Error is: ${e}`))

async function main() {
    await mongoose.connect(MONGO_URL)
}
async function seedStocks() {
    await Stock.deleteMany({});
    let a = await Stock.insertMany(initData.data);
    console.log("Stocks added!");
    console.log(a)
}

seedStocks();
