const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const User = require('./models/users');
const Stock = require('./models/stocks')
const PORT = 4000;
const session = require('express-session')
const passport = require('passport')
const localStatregy = require('passport-local')
const methodOverride = require('method-override')

const sessionOptions = { secret: "MysuperseceretSession", resave: false, saveUninitialized: true }
app.use(session(sessionOptions))
app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStatregy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


const MONGO_URL = "mongodb://127.0.0.1:27017/stockExchange"

main().then(() => {
    console.log("Connected to the database")
}).catch((e) => {
    console.log(`Error is: ${e}`)
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.render('home', { user: req.user }); // show if logged in or not
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Register page
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = new User({ username });
        await User.register(user, password); // saves user with hashed password
        res.redirect('/login');
    } catch (e) {
        res.send("Error: " + e.message);
    }
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/stocks',
    failureRedirect: '/login'
}));

// Logout
app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

// Index/Stocks Route
app.get('/stocks', isLoggedIn, async (req, res) => {
    let userStocks = await Stock.find({ user: req.user._id }); // 👈 only current user's stocks
    res.render('stocks', { allStocks: userStocks });
})


//Buy Stocks
app.get('/stocks/new', isLoggedIn, (req, res) => {
    res.render('new'); // form to buy stock
});

// show Route
app.get('/stocks/:id', async (req, res) => {
    let { id } = req.params;
    let stoc = await Stock.findById(id);
    console.log(stoc)
    res.render('show', { stoc })
})
app.post('/stocks', isLoggedIn, async (req, res) => {
        const stock = new Stock(req.body.stock);
        stock.user = req.user._id; // associate purchase with user
        await stock.save();
        res.redirect(`/stocks/${stock._id}`);
});


app.delete('/stocks/:id', isLoggedIn, async (req, res) => {
        let { id } = req.params;
        let deleteList = await Stock.findByIdAndDelete(id);
        console.log("Deleted Stock: ",deleteList)
        res.redirect('/stocks')
})

app.listen(4000, () => {
    console.log(`app is running on http://localhost:${PORT}`)
})