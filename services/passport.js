// Passport.JS
const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

// Specific Strategy for Google OAuth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const privateKeys = require('../config/keys');

passport.use(new GoogleStrategy({
        clientID: privateKeys.googleClientID,
        clientSecret: privateKeys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, function(accessToken, refreshToken, profile, done){
        User.findOne({ googleId: profile.id })
            .then(existingUser => {
                if (existingUser) {
                    // User Found
                    done(null, existingUser);
                } else {
                    // Create New User
                    new User({
                        googleId: profile.id,
                        firstName: profile.name.familyName,
                        lastName: profile.name.givenName,
                        gender: profile.gender
                    })
                        .save()
                        .then(user => done(null, user));
                }
        });
    })
);