import { MapLocation } from "./MapLocation.js";
import { locations } from "./landmarks.js";

export class MyMap {
    constructor(locations) {
        this.zoomLevel = 1;
        this.currentMap = 0;
        this.mapContainer = document.getElementById('mapContainer');
    }

    /**
     * @param {number} mapId
     */
    loadMapContents(mapId) {
        console.log(`load map: ${mapId}`);
        this.mapContainer.innerHTML = '';
        this.loadNewMap(mapId);
        this.loadMapBoxes(mapId);
        this.loadLocations(mapId);


    }

    loadLocations(mapId) {
        let topLeft = null;
        let bottomRight = null;
        let width = 0;
        let height = 0;

        switch (mapId) {
            case 0:
                topLeft = { lat: 39.517613664693144, lng: -0.4889598892509934 };
                bottomRight = { lat: 39.41638957400675, lng: -0.2798250336621361 };
                width = 1216;
                height = 765;
                break;
            case 1:
                topLeft = { lat: 39.483261068597244, lng: -0.3892695502956495 };
                bottomRight = { lat: 39.46374828519189, lng: -0.3625953669880743 };
                width = 880;
                height = 844;
                break;
            case 3:
                topLeft = { lat: 39.47984233446074, lng: -0.38100917046648236 };
                bottomRight = { lat: 39.47438970469787, lng: -0.37436905527495845 };
                width = 733;
                height = 783;
                break;
            case 4:
                topLeft = { lat: 39.479314419480076, lng: -0.37638889230524286 };
                bottomRight = { lat: 39.47470068660812, lng: -0.3685579114508993 };
                width = 1057;
                height = 802;
                break;
        }


        const mapLocation = new MapLocation(topLeft, bottomRight, width, height);

        console.log(`locations: ${locations.length}`);

        locations.forEach(loc => {
            const dotRadius = 0;
            const point = mapLocation.getLocationOnMap(loc.lat, loc.lng);
            if (!point) {
                return;
            }
            const { x, y } = point;
            // Create dot
            const dot = document.createElement('category-icon');
            dot.style.position = 'absolute';
            dot.style.left = `${x - 20}px`;
            dot.style.top = `${y - 27}px`;
            dot.setAttribute('label', loc.title ?? '');
            dot.setAttribute('category', loc.cat ?? 'i');
            dot.setAttribute('color', loc.color ?? 'red');
            // dot.style.zIndex = 1000;
            dot.addEventListener('click', () => showInfo(loc));
            this.mapContainer.appendChild(dot);
        });
    }

    loadMapBoxes(mapId) {
        if (mapId == 0) {
            this.appendBoxToMap({ mapId: 1, x: 570, y: 250, w: 150, h: 150 });
        };

        if (mapId == 1) {
            this.appendBoxToMap({ mapId: 3, x: 270, y: 120, w: 200, h: 220 });
            this.appendBoxToMap({ mapId: 4, x: 400, y: 180, w: 200, h: 220 });
        }

    }

    loadNewMap(mapId) {
        const mapPicture = document.createElement('img');

        switch (mapId) {
            case 0:
                mapPicture.src = './images/Valencia.jpg';
                break;
            case 1:
                mapPicture.src = './images/Valencia-OldTown.jpg';
                break;
            case 3:
                mapPicture.src = './images/Valencia-OldTown-North.jpg';
                break;
            case 4:
                mapPicture.src = './images/Valencia-OldTown-North-East.jpg';
                break;
            default:
                alert(`Map ${mapId} does not exist`);
        }

        this.mapContainer.appendChild(mapPicture);



    }

    loadNextLevelMapBoxes(mapId) {
        const mapPositions = new MapPositions();
        const boxDetails = mapPositions.returnBoxSizeAndPosition(mapId);
    }

    appendBoxToMap({ mapId, x, y, w, h }) {
        const container = document.getElementById("mapContainer");

        const box = document.createElement("div");

        box.id = `map-box-${mapId}`;
        box.style.position = "absolute";
        box.style.left = x + "px";
        box.style.top = y + "px";
        box.style.width = w + "px";
        box.style.height = h + "px";

        box.addEventListener("click", () => {
            this.loadMapContents(mapId);
        });

        // optional styling so you can see it
        box.style.border = "2px solid red";
        box.style.backgroundColor = "rgba(255,0,0,0.2)";

        container.appendChild(box);
    }

}

class MapPositions {
    returnBoxSizeAndPosition(mapId) {
        return { x: 200, y: 200, w: 200, h: 100 };
    }
}