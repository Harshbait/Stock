const mongoose = require("mongoose");
const Stock = require("../models/stocks");
const User = require("../models/users");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/stockExchange";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => console.log(`Error is: ${e}`));

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function seedStocksAndUsers() {

  await Stock.deleteMany({});
  await User.deleteMany({});


  let stocks = await Stock.insertMany(initData.data);
  console.log("Stocks added!");

  const usernames = ["user1", "user2", "user3", "user4", "user5"];
  const users = [];

  for (let name of usernames) {
    let user = new User({ username: name });

    // random 2 stocks assign
    let chosenStocks = stocks.sort(() => 0.5 - Math.random()).slice(0, 2);

    chosenStocks.forEach((stock) => {
      let randomQty = Math.floor(Math.random() * 5) + 1; // 1–5 qty
      user.portfolio.push({
        stockId: stock._id,
        quantity: randomQty,
      });
    });

    await user.setPassword("1234");
    await user.save();
    users.push(user);
  }

  console.log("Users added with portfolios!");
  console.log(users);
}

seedStocksAndUsers();
