const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isAuthor } = require('../utils/middleware');
const reviews = require('../controllers/reviews');

// ROUTES
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewID', isLoggedIn, isAuthor, catchAsync(reviews.deleteReview));

// EXPORTS
module.exports = router;