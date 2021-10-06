const Campground = require('../models/campground');
// const Review = require('../models/review');
// const User = require('../models/user');
const { cloudinary } = require('../utils/cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    const index = parseInt(req.query.page) ? req.query.page : 0;
    const numItems = parseInt(req.query.items) ? req.query.items : 10;
    res.render('campgrounds/index', { campgrounds, index, numItems });
}

module.exports.indexPaginated = (req, res) => {
    const { page, items } = req.body;
    if (page) {
        res.redirect(`/campgrounds?page=${page}`);
    } else {
        res.redirect(`/campgrounds?items=${items}`);
    }
}

module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', `Campground with id '${id}' can't be found'`);
        return res.redirect('/campgrounds');
    }
    req.session.returnTo = req.originalUrl;
    res.render('campgrounds/show', { campground });
}

module.exports.postCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully posted a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', `Campground with id '${id}' can't be found'`);
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Successfully updated ${req.body.campground.title}`);
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground');
    res.redirect('/campgrounds');
}