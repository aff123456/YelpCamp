const Campground = require('../models/campground');
const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginGet = (req, res) => {
    res.render('users/login');
}

module.exports.loginPost = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfulyl logged you out!');
    res.redirect('/');
}

module.exports.showCampgroundsByUser = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.find({ author: id });
    res.render('campgrounds/user', { campgrounds });
}