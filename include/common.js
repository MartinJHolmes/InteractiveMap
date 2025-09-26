// ========================
// Simple asynchronous wait
// ------------------------
async function doWait(waitTime) {
    let myPromise = new Promise(function (myResolve, myReject) {
        setTimeout(function () { myResolve(true) }, waitTime);
    })
    await myPromise;
}

function logMessage(message) {
    // Append message to textarea and scroll to bottom
    logBox.value += message + "\n";
    logBox.scrollTop = logBox.scrollHeight;
    console.log(message); // still log to console
}

function showLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;

            // Print GPS position to textarea
            logMessage(`Current Position -> Latitude: ${latitude}, Longitude: ${longitude}`);

            const point = mapLocation.getLocationOnMap(latitude, longitude);
            if (!point) {
                return;
            }
            const { x, y } = point;
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            dot.style.display = 'block';
            dot.style.animation = 'none';
            void dot.offsetWidth;
            dot.style.animation = 'pulse 1.5s infinite, stopAfter 5s forwards';
        }, (error) => {
            logMessage("Error getting location: " + error.message);
        });
    } else {
        logMessage("Geolocation is not supported by this browser.");
    }
}

async function showCurrentLocation() {
    for (let i = 0; i < 10000000; i++) {
        showLocation();
        await doWait(10000);

    }
}

const map = document.getElementById('map');
const dot = document.getElementById('dot');
const logBox = document.getElementById('log');

const infoBox = document.getElementById('infoBox');
const infoTitle = document.getElementById('infoTitle');
const infoDesc = document.getElementById('infoDesc');


function showInfo(location) {
    infoTitle.textContent = location.title;
    infoDesc.textContent = location.description;
    infoBox.style.display = 'block';
}

function hideInfo() {
    infoBox.style.display = 'none';
}

function drawLocations() {
    locations.forEach(loc => {
        const point = mapLocation.getLocationOnMap(loc.lat, loc.lng);
        if (!point) {
            return;
        }
        const { x, y } = point;
        // Create dot
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.addEventListener('click', () => showInfo(loc));
        map.appendChild(dot);

        // Create label
        const label = document.createElement('div');
        label.className = 'label';
        label.style.left = `${x + 5}px`; // offset a bit to the right
        label.style.top = `${y}px`;
        label.textContent = loc.title;
        label.addEventListener('click', () => showInfo(loc));
        map.appendChild(label);
    });
}