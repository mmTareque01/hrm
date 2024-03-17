/*
    POST /login -> authentificate in the system
    GET /       -> get to the login page

    The functions passport.use, passport.serializeUser, passport.deserializeUser are taken from the
    official documentation http://www.passportjs.org/docs and adapted to the User model of this system
*/

const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./../server/models/user.js");
const { getUserByUsername, comparePassword, getUserById } = require("../service/login.js");

/*
    GET / -> get to the login page
*/
router.get("/", (req, res) => {
  res.render("login", { layout: false });
});

/*
    POST /login -> authentificate the user
*/
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/app",
    failureRedirect: "/",
    failureFlash: true,
  }),
  function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect("/app");
  }
);

// the Middleware for authetification -> provided by the passport library
passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "Unknown User" });
    }
    const isMatched = await comparePassword(password, user?.password);

    if (isMatched) {
        return done(null, user);
      } else {
        return done(null, false, "Invalid password");
      }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
    try{
        const userId = await getUserById(id)
        console.log("userId : ", userId.id)
        done(null, userId.id);
    }
    catch(error){
        done(error, null);
    }
    
    
//   User.getUserById(id, function (err, user) {
    
//   });
});

module.exports = router;
