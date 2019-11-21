// Store our API endpoint inside queryUrl

const API_KEY = "pk.eyJ1IjoiZGVicmFmODYiLCJhIjoiY2sycnNnMWU5MDJtaDNjbzNmYTk4ZTNrYiJ9.jlMwpUQdiDXcDHGJ_SYMbA";

function chooseColor(magnitude) {

    if (magnitude > 5.0) {
        return "tomato";
    }
    if (magnitude > 4.0) {
        return "darkorange";
    }
    if (magnitude > 3.0) {
        return "orange";
    }
    if (magnitude > 2.0) {
        return "gold";
    }
    if (magnitude > 1.0) {
        return "yellow";
    }
    return "greenyellow";
}


function buildUrl(){
    const
        domain = "earthquake.usgs.gov",
        // all earthquakes in the last hour
        endpoint = "/earthquakes/feed/v1.0/summary/all_hour.geojson";
        format = "geojson",
        maxLon = -69.52148437,
        minLon = -123.83789062,
        maxLat = 48.74894534,
        minLat = 25.16517337;

    // return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;

    return `https://${domain}${endpoint}?format=${format}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
}


function buildPlateUrl(){
    const
        domain = "earthquake.usgs.gov",
        // all earthquakes in the last hour
        endpoint = "/earthquakes/feed/v1.0/summary/all_hour.geojson";
        format = "geojson",
        maxLon = -69.52148437,
        minLon = -123.83789062,
        maxLat = 48.74894534,
        minLat = 25.16517337;
        platesUrl = "github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json";


    // return `https://${domain}${endpoint}?format=${format}&starttime=${starttime}&endtime=${endtime}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;

    return `https://${platesUrl}?format=${format}&maxlongitude=${maxLon}&minlongitude=${minLon}&maxlatitude=${maxLat}&minlatitude=${minLat}`;
}


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + " Magnitude" + feature.properties.mag +"</p>");
    }

    function createCircleMarker(feature, latlng){
        let options = {
            radius: .5
        }
        return L.circleMarker(latlng, options);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {

        style: function(feature){
            return {
                color: "black",
                weight:2,
                opacity: .75,
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 1.0,
                radius: feature.properties.mag *5 // need to account for null value
            }
        },
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        },        
        
        onEachFeature: onEachFeature

    });

    console.log(earthquakes);

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {

    // setup the legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "info legend");
        const magnitudes = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        const colors = ["greenyellow", "yellow", "gold", "orange", "darkorange", "tomato"];

        // for (var i=0; i<magnitudes.length; i++) {
        //     div.innerHTML += 
        //     '<li style="background:' + colors[i+1]+ '"></i> ' +
        //     magnitudes[i] + (magnitudes[i+1] ? '&ndash;' + magnitudes[i+1] + '<br>' : '+');
        // }

        // for (var i=0; i<magnitudes.length; i++) {
        //     div.innerHTML += "<li style=\"background-color: " + color[i] + "\"></li>" + 
        //     magnitudes[i] + "<br>" ;
        // }

        // const legendInfo = "<h2>Magnitude</h2>" +
        // "<div class=\"labels\">" +
        // "<div class =\"min\">" + magnitudes[0] + "</div>" +
        // "<div class=\"max\">" + magnitudes[magnitudes.length - 1] + "</div>" +
        // "</div>";

        const legendInfo = "<h3>Earthquake Magnitude</h3>" +
        "<div class=\"labels\">" + '&nbsp;' + magnitudes[0] + 
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + magnitudes[1] + 
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + magnitudes[2] +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + magnitudes[3] +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + magnitudes[4] +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + magnitudes[5] +
        "</div>";

       
        div.innerHTML = legendInfo;

        const labels = magnitudes.map((magnitude, index) =>{
            return "<li style=\"background-color: " + colors[index] + "\"></li>";
        })

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;

    };

    
    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);

    legend.addTo(myMap);
}


(async function(){
    const queryUrl = buildUrl();

    console.log (queryUrl);

    // const platesUrl = buildPlateUrl();
    // console.log(platesUrl);

    const data = await d3.json(queryUrl);

    // const plateData = await d3.json(platesUrl);

    // console.log(plateData);

    // Once we get a response, send thd features object to the createFeatures function
    createFeatures(data.features);


})()
