const express = require('express');
const mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser')
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser')
const passport = require('passport');


const userRouter = require('./routes/users');
const User = require('./models/User');

const app = express();
// flash middleware
app.use(cookieParser("passporttutorial"));
app.use(session({ cookie: { maxAge: 60000 }, resave: true, secret: "passporttutorial", saveUninitialized: true }));
app.use(flash());
// passport insilaize
app.use(passport.initialize());
app.use(passport.session());

// global middleware
app.use((req, res, next) => {
    // our on flash
    res.locals.flashSuccess = req.flash("flashSuccess");
    res.locals.flashError = req.flash("flashError");
    // passport flash
    res.locals.passportFailure = req.flash("error");
    res.locals.passportSuccess = req.flash("success");

    // our logged in user
    res.locals.user = req.user;
    next();
});
// mongodb connection
mongoose.connect("mongodb+srv://cancelik:1234567a@cancelik.pjjlu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("connected to mongo db")
})

// template engine middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const PORT = process.env.PORT || 7000;

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// user-router middleware
app.use(userRouter);


app.get('/', (req, res, next) => {
    User.find({})
        .then(users => {
            res.render("pages/index", { users });
        }).catch(err => console.log(err));
});

app.use((req, res) => {
    res.render('static/404');
});

app.listen(PORT, () => {
    console.log(`server is ${PORT} working`);
});