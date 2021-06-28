const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/User")

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) return done(err, null, "bir hata olustu");

        if (!user) {
            return done(null, false, "user Not Found");
        }

        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
                return done(null, user, "succssully logged in");
            } else {
                return done(null, false, "incorrect passport");
            }
        })
    })

}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});