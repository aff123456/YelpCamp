const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Created a new review for ${campground.title}`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    // const { id, reviewID } = req.params;
    // await Review.findByIdAndDelete(reviewID);
    // const campground = await Campground.findById(id);
    // const index = campground.reviews.indexOf(reviewID);
    // campground.reviews.splice(index, 1);
    // res.redirect(`/campgrounds/${id}`);
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted a review');
    res.redirect(`/campgrounds/${id}`);
}