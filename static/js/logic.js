var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log (API_quakes)
var API_plates = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"
console.log (API_plates)

function markerSize(magnitude) {
    return magnitude * 4;
};


var earthquakes = new L.LayerGroup();

d3.json(API_quakes, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {  
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});

var plateBoundary = new L.LayerGroup();

d3.json(API_plates, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {
                weight: 2,
                color: 'magenta'
            }
        },
    }).addTo(plateBoundary);
})


function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};

function createMap() {

    var highContrastMap = L.tileLayer('https://api.tiles.mapbox.com/v4/mnperic.id/1/0/1@2x.png?access_token=pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.high-contrast',
        accessToken: 'pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g'
    });

    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/mnperic/2/0/1.png?access_token=pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g'
    });

    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/mnperic/2/0/1.png?access_token=pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.dark',
        accessToken: 'pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g'
    });


    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/mnperic/2/0/1.png?access_token=pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoibW5wZXJpYyIsImEiOiJjbDBna21xY24xM3djM2NxdHk0cGRpaHp0In0.sJWr8l8WMrB7a8jGuD4F7g'
    });


    var baseLayers = {
        "High Contrast": highContrastMap,
        "Street": streetMap,
        "Dark": darkMap,
        "Satellite": satellite
    };

    var overlays = {
        "Earthquakes": earthquakes,
        "Plate Boundaries": plateBoundary,
    };

    var mymap = L.map('mymap', {
        center: [40, -99],
        zoom: 4.3,
        // timeDimension: true,
        // timeDimensionOptions: {
        //     timeInterval: "2018-04-01/2018-04-05",
        //     period: "PT1H"
        // },
        // timeDimensionControl: true,
        layers: [streetMap, earthquakes, plateBoundary]
    });

    L.control.layers(baseLayers, overlays).addTo(mymap);
    // L.timeDimension.earthquakes.geoJson(earthquakes).addTo(mymap);
    // L.control.timeDimension().addTo(mymap);
    // var player = new L.TimeDimension.Player({}, timeDimension).addTo(mymap);

    // var tdWmsLayer = L.timeDimension.layer.wms(wmsLayer);
    // tdWmsLayer.addTo(map);

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}

// createMap()