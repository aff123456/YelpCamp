const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../utils/middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

// ROUTES
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.postCampground))

router.post('/sort', campgrounds.indexPaginated)

router.get('/new', isLoggedIn, campgrounds.newCampground)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .patch(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground));

// router.get('/', catchAsync(campgrounds.index));
// router.get('/:id', catchAsync(campgrounds.showCampground));
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.postCampground));
// router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// EXPORTS
module.exports = router;