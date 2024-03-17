require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
// const exphbs = require("express-handlebars");
const { engine } = require('express-handlebars');

const expressValidator = require("express-validator");
const { body, validationResult } = require("express-validator");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongo = require("mongodb");
const {db} = require("./server/db/mongoose")

// var {mongoose} = require('./server/db/mongoose.js');

const port = process.env.PORT || 3000;

/*
    View Engine
*/
var app = express();
// app.use([path,] callback [, callback...]) -> puts middleware fot the app
app.use(express.static(__dirname + "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(favicon(__dirname + "/public/favicon.ico"));
// app.engine('.extenionName', renderingEngine) -> renders files
app.engine('handlebars', engine({defaultLayout: 'layout'}));
// // app.set('view engine', 'engineToUse') -> sets default viewing engine
app.set("view engine", "handlebars");

/*
    Bodyparser Middleware + Express session
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// session -> keep the user loggin after he login in on the website
//         -> creates an object req.session, where you can add properties
//         -> (ex: req.session.page_views, to count how many times he entered on the page)
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

/*
    Initialize Passport (authetification) to keep persisten login data (i.e in cookies)
*/
app.use(passport.initialize());
app.use(passport.session());

/*
     Validator to validate data incoming with the re object to the server
*/
// app.use(
//   expressValidator.ExpressValidator({
//     errorFormatter: function (param, msg, value) {
//       var namespace = param.split("."),
//         root = namespace.shift(),
//         formParam = root;

//       while (namespace.length) {
//         formParam += "[" + namespace.shift() + "]";
//       }
//       return {
//         param: formParam,
//         msg: msg,
//         value: value,
//       };
//     },
//   })
// );

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
});


/*
    Flash to pop-up mesages in the browser
*/
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/*
    Ensure authetification
*/
app.use('/app', (req, res, next) => {
    // check to be authentificated
    if (req.isAuthenticated()) { // if yes, continue
        return next();
    } else {                     // if no, login
        // req.flash('error_msg', 'You are not logged in');
        res.redirect('/');
    }
});

// Define a route
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

/*
    Website routes
*/

app.use("/l", async (req, res)=>{
    // const user = await createUser({username:"admin", password:"admin"})
    const user = await loginDemo("admin", "admina")
    console.log("output: ",user)
    res.send(user)
})
var login = require('./routes/login');
var users = require('./routes/users');
var appRoute = require('./routes/app');
var patients = require('./routes/patients');
var settings = require('./routes/settings');
var diseases = require('./routes/diseases');
var rooms = require('./routes/rooms');
const { createUser, loginDemo } = require("./service/login");

app.use('/', login);
app.use('/', appRoute);
app.use('/', users);
app.use('/', patients);
app.use('/', settings);
app.use('/', diseases);
app.use('/', rooms);

var timestamp = new Date().getTime();

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
