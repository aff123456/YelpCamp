const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

// ROUTES
router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.loginGet)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginPost)

router.get('/logout', users.logout);

router.get('/user/:id', catchAsync(users.showCampgroundsByUser))

// router.get('/register', users.registerForm);
// router.post('/register', catchAsync(users.register));
// router.get('/login', users.loginGet);
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginPost);

// EXPORTS
module.exports = router;