const formValidation = require("../validation/formValidation");
var bcrypt = require('bcryptjs');
const User = require("../models/User");
const passport = require("passport");
require('../authencation/passport/local');
module.exports.getUserLogin = (req, res, next) => {
    res.render('pages/login');
}
module.exports.getUserRegister = (req, res, next) => {
    res.render('pages/register');
}
module.exports.postUserLogin = (req, res, next) => {
    passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", failureFlash: true, successFlash: true })(req, res, next);
}
module.exports.postUserRegister = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    const errors = [];
    const validationErrors = formValidation.registerValidation(username, password);
    if (validationErrors.length > 0) {
        return res.render("pages/register", {
            username: username,
            password: password,
            errors: validationErrors
        });
    }


    User.findOne({
        username
    }).then(user => {
        if (user) {
            errors.push({ message: "username already in use" });
            return res.render("pages/register", {
                username,
                password,
                errors
            })

        }
    }).catch(err => console.log(err))

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err) throw err;
            const newUser = new User({
                username: username,
                password: hash
            });
            newUser.save()
                .then(() => {
                    console.log("user save success");
                    req.flash("flashSuccess", "successfully Registred");
                    res.redirect('/');
                })
                .catch(err => console.log(err));
        });
    });
}