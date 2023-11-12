'use strict';

let start, end; // Declare start and end variables at the beginning

let CustomRouteLayer; // Declare CustomRouteLayer in a higher scope

// default map layer
let map = L.map('map', {
  layers: MQ.mapLayer(),
  center: [49.6942, -124.9990], // Courtenay coordinates
  zoom: 12 // Adjust the zoom level as needed
});

// Function to get the current location and convert it to an address
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Use MapQuest Geocoding API to convert coordinates to address
            const geocodingApiUrl = `https://www.mapquestapi.com/geocoding/v1/reverse?key=S8d7L47mdyAG5nHG09dUnSPJjreUVPeC&location=${latitude},${longitude}&includeRoadMetadata=true&includeNearestIntersection=true`;

            // Fetch the address using the Geocoding API
            fetch(geocodingApiUrl)
                .then(response => response.json())
                .then(data => {
                    const address = data.results[0].locations[0].street;
                    // Set the starting point field with the current address
                    document.getElementById('start').value = address;
                })
                .catch(error => {
                    console.error('Error fetching address:', error);
                });
        }, function (error) {
            console.error('Error getting current location:', error.message);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function runDirection(start, end) {
    // recreating new map layer after removal
    map = L.map('map', {
        layers: MQ.mapLayer(),
        center: [35.791188, -78.636755],
        zoom: 12
    });

    var dir = MQ.routing.directions();

    dir.route({
        locations: [
            start,
            end
        ]
    });

    CustomRouteLayer = MQ.Routing.RouteLayer.extend({
        createStartMarker: (location) => {
            var marker = L.marker(location.latLng).addTo(map);
            return marker;
        },

        createEndMarker: (location) => {
            var marker = L.marker(location.latLng).addTo(map);
            return marker;
        }
    });

    map.addLayer(new CustomRouteLayer({
        directions: dir,
        fitBounds: true
    }));
}

// function that runs when button clicked
function getDirections() {
    // delete current map layer
    map.remove();

    // getting form data
    start = document.getElementById("start").value;
    end = document.getElementById("destination").value;

    // run directions function
    runDirection(start, end);

    // reset form
    document.getElementById("form").reset();
}

// assign the button to button variable
const getDirectionsBtn = document.getElementById('getDirectionsBtn');

// call the getDirections() function when button is clicked
getDirectionsBtn.addEventListener('click', getDirections);

// call getCurrentLocation() when the page loads
getCurrentLocation();
