const busStops = [
    { name: "Xavier", coords: { lat: 14.5995, lng: 121.0723 }, travelTime: 84 }, // 1 min 24 sec
    { name: "Cov Courts", coords: { lat: 14.6000, lng: 121.0730 }, travelTime: 96 }, // 1 min 36 sec
    { name: "Stairs to Barangka", coords: { lat: 14.5985, lng: 121.0720 }, travelTime: 78 }, // 1 min 18 sec
    { name: "Grade School", coords: { lat: 14.5980, lng: 121.0715 }, travelTime: 90 }, // 1 min 30 sec
    { name: "JSEC", coords: { lat: 14.5987, lng: 121.0728 }, travelTime: 96 }, // 1 min 36 sec
    { name: "2.5", coords: { lat: 14.5970, lng: 121.0735 }, travelTime: 84 }, // 1 min 24 sec
    { name: "Leong", coords: { lat: 14.5990, lng: 121.0710 }, travelTime: 108 }, // 1 min 48 sec
];

let map;
let eJeepMarkers = [];
const eJeepCount = 4;
const eJeepAnimationInterval = 2000; // Move every 2 seconds

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 14.5995, lng: 121.0723 },
        zoom: 15,
    });

    busStops.forEach(stop => {
        new google.maps.Marker({
            position: stop.coords,
            map: map,
            title: stop.name,
        });
    });

    for (let i = 0; i < eJeepCount; i++) {
        const marker = new google.maps.Marker({
            position: busStops[0].coords,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: 'blue',
                fillOpacity: 0.6,
                strokeWeight: 1,
            },
        });
        eJeepMarkers.push({ marker: marker, currentStopIndex: 0 });
    }

    animateEJeep();
    populateStopDropdown();
}

function populateStopDropdown() {
    const selector = document.getElementById("stopSelector");
    busStops.forEach((stop, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = stop.name;
        selector.appendChild(option);
    });

    selector.addEventListener("change", (event) => {
        const selectedStop = busStops[event.target.value];
        const eta = calculateETA(selectedStop);
        document.getElementById("eta").innerText = `ETA to ${selectedStop.name}: ${eta} seconds`;
    });
}

function calculateETA(stop) {
    return stop.travelTime; // Return travel time in seconds
}

function animateEJeep() {
    setInterval(() => {
        eJeepMarkers.forEach(eJeep => {
            eJeep.currentStopIndex = (eJeep.currentStopIndex + 1) % busStops.length;
            const nextStop = busStops[eJeep.currentStopIndex].coords;

            eJeep.marker.setPosition(nextStop);
        });
    }, eJeepAnimationInterval);
}

google.maps.event.addDomListener(window, "load", initMap);
