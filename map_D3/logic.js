// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><h3>" + "Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  function circleColor(magnitude) {
    var color = '';
    if (magnitude > 5) {
      color = 'red';
    } else if (magnitude > 4) {
      color = 'orange';
    } else if (magnitude > 3) {
      color = 'yellow';
    } else if (magnitude > 2) {
      color = 'green';
    } else if (magnitude > 1) {
      color = 'greenyellow';
    } else {
      color = 'lightgreen';
    }
    return color;
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, layer) {
      return L.circleMarker(layer, {
        radius: feature.properties.mag * 3,
        fillColor: circleColor(feature.properties.mag),
        color: 'black',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5
      });
    }
  });

  

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}





function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 14,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -45.71
    ],
    zoom: 3,
    layers: [darkmap, earthquakes]
  })
  var w = 300, h = 50;

  var key = d3.select(".leaflet-top")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  var legend = key.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "green")
    .attr("stop-opacity", 1);

  legend.append("stop")
    .attr("offset", "33%")
    .attr("stop-color", "yellow")
    .attr("stop-opacity", 1);

  legend.append("stop")
    .attr("offset", "66%")
    .attr("stop-color", "orange")
    .attr("stop-opacity", 1);

  legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

  key.append("rect")
    .attr("width", w)
    .attr("height", h - 30)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

  var y = d3.scaleLinear()
    .range([300, 0])
    .domain([8, 0]);

  var yAxis = d3.axisBottom()
    .scale(y)
    .ticks(5);

  key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,30)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("axis title");

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
};