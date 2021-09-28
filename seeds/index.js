if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
// const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl)
    .then(() => console.log('Connection OPEN!'))
    .catch((err) => console.log('Connection error! ', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Database connected'));

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedBD = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    await User.deleteMany({});
    let numSeeds = 5;
    let numReviews = 3;
    let numUsers = 3;
    if (process.argv[2]) {
        const newSeed = parseInt(process.argv[2], 10);
        if (!isNaN(newSeed)) {
            numSeeds = newSeed;
        }
    }
    if (process.argv[3]) {
        const newReviews = parseInt(process.argv[3], 10);
        if (!isNaN(newReviews)) {
            numReviews = newReviews;
        }
    }
    if (process.argv[4]) {
        const newUsers = parseInt(process.argv[4], 10);
        if (!isNaN(newUsers)) {
            numUsers = newUsers;
        }
    }
    for (let i = 0; i < numUsers; i++) {
        const rand = Math.floor(Math.random() * 10000 * numUsers) + 1;
        const email = `${rand}@gmail.com`;
        const username = `${rand}`;
        const user = new User({ email, username });
        await User.register(user, 'monkey');
        for (let j = 0; j < numSeeds; j++) {
            const random1000 = Math.floor(Math.random() * 1000) + 1;
            // const city = cities[random1000].city;
            // const geoData = await geocoder.forwardGeocode({
            //     query: city,
            //     limit: 1
            // }).send();
            const geoData = {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            };
            const camp = new Campground({
                title: `${sample(descriptors)} ${sample(places)}`,
                images: [],
                price: (Math.random() * 1000).toFixed(2),
                description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta animi ducimus perferendis atque debitis quod? Nihil quas tempora consectetur iure ex labore, quisquam harum minus voluptate, vitae cumque porro perspiciatis?',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                // geometry: geoData.body.features[0].geometry,
                geometry: geoData,
                author: user._id
            });
            pushImages(camp);
            await camp.save();
        }
    }
    const campgrounds = await Campground.find({});
    const users = await User.find({});
    for (let campground of campgrounds) {
        let reviewArray = [];
        for (let j = 0; j < numReviews; j++) {
            const score = Math.floor(Math.random() * 5) + 1;
            let author = getRandom(users);
            while (campground.author.equals(author._id)) {
            // while (author._id === campground.author._id) {
                author = getRandom(users);
            }
            const review = new Review({ body: 'sample', rating: score, author: author._id });
            await review.save();
            reviewArray.push(review);
        }
        campground.reviews = reviewArray;
        await campground.save();
    }
    // console.log(getRandom(users));
    // for (let i = 0; i < numSeeds; i++) {
    //     const random1000 = Math.floor(Math.random() * 1000) + 1;
    //     const camp = new Campground({
    //         title: `${sample(descriptors)} ${sample(places)}`,
    //         image: 'https://source.unsplash.com/collection/483251',
    //         price: (Math.random() * 1000).toFixed(2),
    //         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta animi ducimus perferendis atque debitis quod? Nihil quas tempora consectetur iure ex labore, quisquam harum minus voluptate, vitae cumque porro perspiciatis?',
    //         location: `${cities[random1000].city}, ${cities[random1000].state}`
    //     });
    //     await camp.save();
    // }
    console.log(`Usage: node index.js [campgrounds/user] [reviews] [users]`);
    console.log(`Created ${numSeeds} new entries/user (${numSeeds * numUsers} total) with ${numReviews} reviews each and ${numUsers} new users`);

    const test = new User({ email: 'test@gmail.com', username: 'test' });
    await User.register(test, 'monkey');
    // const c = new Campground({ title: 'Purple Fields' });
    // await c.save();
}

const getRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const pushImages = (campground) => {
    const hardcodedImages = [
        {
            url: 'https://res.cloudinary.com/aff123456/image/upload/v1632248107/YelpCamp/f6c65q327dxqm8y04q80.jpg',
            filename: 'YelpCamp/f6c65q327dxqm8y04q80'
        },
        {
            url: 'https://res.cloudinary.com/aff123456/image/upload/v1632248108/YelpCamp/muzkhacsiqyj20igym2u.png',
            filename: 'YelpCamp/muzkhacsiqyj20igym2u'
        },
        {
            url: 'https://res.cloudinary.com/aff123456/image/upload/v1632248111/YelpCamp/jp7xdov8wfawraxuhcnp.png',
            filename: 'YelpCamp/jp7xdov8wfawraxuhcnp'
        },
        {
            url: 'https://res.cloudinary.com/aff123456/image/upload/v1632248110/YelpCamp/nrgwya2lur5xy748cjkc.jpg',
            filename: 'YelpCamp/nrgwya2lur5xy748cjkc'
        }
    ];
    for (let img of hardcodedImages) {
        campground.images.push(img);
    }
}

seedBD().then(() => mongoose.connection.close());