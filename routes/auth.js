var express = require('express');
var router = express.Router();
var passport = require('passport');

/* Use Passport JS for Google. Response returns to auth/google/callback */
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

/* Passport internall sees 'code?cnwoic' and knows to Call back for info */
router.get('/google/callback', passport.authenticate('google'));

router.get('/api/current_user', (req, res) => {
    res.send(req.user);
});

router.get('/api/logout', (req, res) => {
   req.logout();
   res.send(req.user);
});

module.exports = router;
