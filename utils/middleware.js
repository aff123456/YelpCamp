const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('./ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas');

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewID } = req.params;
    if (!reviewID) {
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id) || !campground.author) {
            req.flash('error', 'You do not have permission to do that');
            return res.redirect(`/campgrounds`);
        }
        return next();
    }
    const review = await Review.findById(reviewID);
    if (!review.author.equals(req.user._id) || !review.author) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}