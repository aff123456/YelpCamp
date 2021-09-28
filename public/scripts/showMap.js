mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    // .setPopup(
    //     new mapboxgl.Popup({ offset: 25 })
    //         .setHTML(
    //             `<h3>${campground.title}</h3>`
    //         )
    // )
    .addTo(map);

map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl());
});