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
    }, async function(accessToken, refreshToken, profile, done){
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
            return done(null, existingUser);
        }

        const user = await new User({
            googleId: profile.id,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            gender: profile.gender
        }).save()
        done(null, user);
    })
);