const busStops = [
    { name: "Xavier", coords: { lat: 14.5995, lng: 121.0723 }, travelTime: 84 },
    { name: "Cov Courts", coords: { lat: 14.6000, lng: 121.0730 }, travelTime: 96 },
    { name: "Stairs to Barangka", coords: { lat: 14.5985, lng: 121.0720 }, travelTime: 78 },
    { name: "Grade School", coords: { lat: 14.5980, lng: 121.0715 }, travelTime: 90 },
    { name: "JSEC", coords: { lat: 14.5987, lng: 121.0728 }, travelTime: 96 },
    { name: "2.5", coords: { lat: 14.5970, lng: 121.0735 }, travelTime: 84 },
    { name: "Leong", coords: { lat: 14.5990, lng: 121.0710 }, travelTime: 108 },
];

let map;
let eJeepMarkers = [];
const eJeepCount = 4;
const eJeepAnimationInterval = 2000;

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
    populateStopDropdowns();
}

function populateStopDropdowns() {
    const originSelector = document.getElementById("originSelector");
    const destinationSelector = document.getElementById("destinationSelector");

    busStops.forEach((stop, index) => {
        const originOption = document.createElement("option");
        originOption.value = index;
        originOption.textContent = stop.name;
        originSelector.appendChild(originOption);

        const destinationOption = document.createElement("option");
        destinationOption.value = index;
        destinationOption.textContent = stop.name;
        destinationSelector.appendChild(destinationOption);
    });

    originSelector.addEventListener("change", updateETA);
    destinationSelector.addEventListener("change", updateETA);
}

function updateETA() {
    const originIndex = document.getElementById("originSelector").value;
    const destinationIndex = document.getElementById("destinationSelector").value;

    if (originIndex !== destinationIndex) {
        const origin = busStops[originIndex];
        const destination = busStops[destinationIndex];
        const eta = calculateETA(destination); // ETA is based on the destination
        document.getElementById("eta").innerText = `ETA from ${origin.name} to ${destination.name}: ${eta} seconds`;
        map.setCenter(destination.coords); // Move map to the selected destination
    } else {
        document.getElementById("eta").innerText = "Please select different origin and destination.";
    }
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

