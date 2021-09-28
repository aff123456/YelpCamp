const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');
const User = require('./user');


const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_800,w_800');
});

imageSchema.virtual('small').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_400,w_400');
});

imageSchema.virtual('title').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,h_450,w_800');
});

const opts = { toJSON: { virtuals: true } }
const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: [Number]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts);

campgroundSchema.virtual('properties.HTMLMarkup').get(function () {
    return `<h5>${this.title}</h5><h6 class="text-muted"><i>${this.location}</i></h6><a href="/campgrounds/${this._id}"><i>View Campground</i></a>`;
})

campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } });
        console.log(res);
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);