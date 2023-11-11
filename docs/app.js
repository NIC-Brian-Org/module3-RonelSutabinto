'use strict';

const apiKey = '3ed5f652c99343e3860d87eb026f79fb';

let map;
let markers = [];
let mode;

function initMap() {
  // Initialize the map
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.geoapify.com/">Geoapify</a>'
  }).addTo(map);
}

function searchLocation() {
  // Clear existing markers and routes
  clearMarkers();

  const locationInput = document.getElementById('locationInput').value;
  mode = document.getElementById('modeSelect').value;

  // Make API request to Geoapify to get location details
  $.get(`https://api.geoapify.com/v1/geocode/search?text=${locationInput}&apiKey=${apiKey}`, function(data) {
    console.log('Geoapify API response:', data);

    if (data && data.features && data.features.length > 0) {
      const coordinates = data.features[0].geometry.coordinates;
      const name = data.features[0].properties.formatted;

      // Add marker for the selected location
      const marker = L.marker(coordinates.reverse()).addTo(map); // Reverse the coordinates
      marker.bindPopup(`<b>${name}</b>`).openPopup();

      // Center the map on the selected location
      map.setView(coordinates, 10);

      markers.push(marker);

      // Get suggested routes
      getDirections(coordinates);
    } else {
      alert('Location not found. Please try again.');
    }
  });
}

function getDirections(destination) {

  // Make API request to Geoapify Directions API to get suggested routes
  $.get(`https://api.geoapify.com/v1/routing?apiKey=${apiKey}&start=${markers[0].getLatLng().lat},${markers[0].getLatLng().lng}&end=${destination[1]},${destination[0]}&mode=${mode}`, function(data) {
    console.log('Geoapify Directions API response:', data);

    if (data && data.features && data.features.length > 0) {
      // Display suggested routes on the map
      data.features.forEach(route => {
        const coordinates = route.geometry.coordinates;
        const polyline = L.polyline(coordinates, { color: 'blue' }).addTo(map);
        markers.push(polyline);
      });
    } else {
      alert('No routes found for the selected mode of travel.');
    }
  });
}

function clearMarkers() {
  // Remove existing markers from the map
  markers.forEach(marker => {
    marker.remove();
  });

  // Clear the markers array
  markers = [];
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', initMap);




