import { locations } from "../data/landmarks.js";
import { maps } from "../data/maps.js";

export class MapCoordinates {
    /**
     * @param {number} mapNumber
     */
    static getCurrentMapCoordinates(mapNumber) {
        const map = maps.find(item => item.id === mapNumber);
        return map;
    }
}


export class MapContainer {
    static currentMapNumber = 2;
    static previousMapNumber = 2;
    static somethingelse = "Martin";
    static width = 0; // 880;
    static height = 0; //844;
    /**
     * @type {Coordinate[]}
     */
    static coordinates = [];
    /**
     * @type {Coordinate[][]}
     */
    static subMaps = [];
    static mapContainerId = document.getElementById('mapContainer');

    /**
     * @param {number} mapNumber
     */
    static async setMap(mapNumber) {
        this.removeCategoryIcons();
        this.removeSubMaps();
        this.previousMapNumber = this.currentMapNumber;
        this.currentMapNumber = mapNumber;
        this.currentMapImage = "";

        let topLeft, bottomRight;

        switch (mapNumber) {
            case 11:
                topLeft = new Coordinate(39.483261068597244, -0.3892695502956495);
                bottomRight = new Coordinate(39.46374828519189, -0.3625953669880743);
                break;
            case 2:
                topLeft = new Coordinate(39.481, -0.38885);
                bottomRight = new Coordinate(39.4716, -0.3643);
                break;

            default:
                // topLeft = new Coordinate(39.483261068597244, -0.3892695502956495);
                // bottomRight = new Coordinate(39.46374828519189, -0.3625953669880743);
                break;
        }

        const map = MapCoordinates.getCurrentMapCoordinates(mapNumber);
        if (map == null) {
            console.log(`error`);
            return;
        }
        topLeft = new Coordinate(map.coordinates.topleft.lat, map.coordinates.topleft.lng);
        bottomRight = new Coordinate(map.coordinates.bottomright.lat, map.coordinates.bottomright.lng);


        this.coordinates = [topLeft, bottomRight];
        let mapPicture = document.getElementById('mapPicture');
        if (mapPicture instanceof HTMLImageElement) {
            mapPicture.src = `./images/${map.image}`;
            // switch(mapNumber) {
            //     case 1: 
            //         mapPicture.src = './images/Valencia-OldTown.jpg';
            //         break;
            //     case 2:
            //         mapPicture.src = './images/OldTown-North2.jpg';
            //         break;
            // }

            await new Promise((resolve, reject) => {
                mapPicture.onload = resolve;
                mapPicture.onerror = reject;
            });

            console.log(mapPicture.naturalWidth);
            console.log(mapPicture.naturalHeight);

            this.width = mapPicture.naturalWidth;
            this.height = mapPicture.naturalHeight;
        }
        this.drawCategoryIcons();
        // this.drawSubMaps(this.currentMapNumber);
        this.drawSubMaps(map);

        this.showCurrentLocation();

    }

    static showLocation(mapLocation) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                // Print GPS position to textarea
                logMessage(`Current Position -> Latitude: ${latitude}, Longitude: ${longitude}`);

                const point = this.returnMapLocation(latitude, longitude);
                if (!point) {
                    return;
                }
                const { x, y } = point;
                const dot = document.getElementById('dot');
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

    static async showCurrentLocation(mapLocation) {
        for (let i = 0; i < 10000000; i++) {
            this.showLocation(mapLocation);
            await doWait(10000);

        }
    }

    /**
     * @param {null | string[]} [categories]
     */
    static drawCategoryIcons(categories) {
        console.log(`locations: ${locations.length}`);

        if(categories == null) {
            let catList = document.getElementById('categoryList');
            categories = catList.value;
        }

        let filtered = locations;

        if (categories != null) {
            console.log(`categories: ${categories}  ${typeof categories}`);
            categories.forEach(cat => {
                console.log(`cat: ${cat}`);
            })
            filtered = locations.filter(item => categories.includes(item.cat));
        } else {

        }


        // locations.forEach(loc => {
        filtered.forEach(loc => {
            const dotRadius = 0;
            const point = this.returnMapLocation(loc.lat, loc.lng);
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
            // @ts-ignore
            this.mapContainerId.appendChild(dot);
        });
    }

    /**
     * @param {number} lat
     * @param {number} lng
     */
    static returnMapLocation(lat, lng) {
        // Linear interpolation to convert GPS to pixel coordinates
        // const x = ((lng - this.topLeft.lng) / (this.bottomRight.lng - this.topLeft.lng)) * this.width;
        const x = ((lng - this.coordinates[0].lng) / (this.coordinates[1].lng - this.coordinates[0].lng)) * this.width;
        // console.log(`${lng - this.coordinates[0].lng} / ${this.coordinates[1].lng - this.coordinates[0].lng} `);
        // console.log(`${(lng - this.coordinates[0].lng) / (this.coordinates[1].lng - this.coordinates[0].lng)}`);
        // console.log(`${x}  ${this.width}`);
        // const y = ((lat - this.topLeft.lat) / (this.bottomRight.lat - this.topLeft.lat)) * this.height;
        const y = ((lat - this.coordinates[0].lat) / (this.coordinates[1].lat - this.coordinates[0].lat)) * this.height;

        if (x < 0 || x > this.width) {
            console.log(`Not on map!!  ${x}`);
            return null;
        }

        if (y < 0 || y > this.height) {
            console.log(`Not on map!!  ${y}`);
            return null;
        }

        // console.log(`x: ${x}  y: ${y}`);
        return { x, y };

    }

    static removeCategoryIcons() {
        document.querySelectorAll("category-icon").forEach(icon => {
            icon.remove();
        });
    }

    static removeSubMaps() {
        document.querySelectorAll(".map-box").forEach(icon => {
            icon.remove();
        });
    }

    
    static drawSubMaps(map) {
        map.submaps.forEach((/** @type {number} */ submap) => {
            const subMapCoordinates = MapCoordinates.getCurrentMapCoordinates(submap);
            this.subMaps = [];
            this.subMaps[0] = [];
            this.subMaps[0][0] = new Coordinate(subMapCoordinates?.coordinates.topleft.lat, subMapCoordinates?.coordinates.topleft.lng);
            this.subMaps[0][1] = new Coordinate(subMapCoordinates?.coordinates.bottomright.lat, subMapCoordinates?.coordinates.bottomright.lng);
            console.log(`currentMap: ${this.currentMapNumber}`);
            this.drawSubMap(subMapCoordinates?.id, this.subMaps[0]);
        });
        // switch (currentMapNumber) {
        //     case 1:
        //         this.subMaps = [];
        //         this.subMaps[0] = [];
        //         this.subMaps[0][0] = new Coordinate(39.48116605818122, -0.388956032528539);
        //         this.subMaps[0][1] = new Coordinate(39.4718232581168, -0.3644874558114586);
        // }
        // console.log(`currentMap: ${this.currentMapNumber}`);
        // this.drawSubMap(2, this.subMaps[0]);
    }

    /**
     * @param {number} mapNumber
     * @param {Coordinate[]} coordinates
     */
    static drawSubMap(mapNumber, coordinates) {
        const container = document.getElementById("mapContainer");

        const box = document.createElement("div");



        box.id = `map-box-${mapNumber}`;
        box.style.position = "absolute";
        let topLeft = this.returnMapLocation(coordinates[0].lat, coordinates[0].lng);
        let bottomRight = this.returnMapLocation(coordinates[1].lat, coordinates[1].lng);
        if (topLeft == null || bottomRight == null) {
            console.log(`drawSubMap() null detected  topLeft: ${topLeft}  bottomRight: ${bottomRight}`);
            return;
        }
        box.style.left = topLeft?.x + "px";
        box.style.top = topLeft?.y + "px";
        box.style.width = (bottomRight?.x - topLeft?.x) + "px";
        box.style.height = (bottomRight?.y - topLeft?.y) + "px";
        box.classList.add('map-box');

        box.addEventListener("click", () => {
            this.setMap(mapNumber);
        });

        // optional styling so you can see it
        box.style.border = "2px solid red";
        box.style.backgroundColor = "rgba(255,0,0,0.1)";

        // container.appendChild(box);
        this.mapContainerId?.appendChild(box);
    }

    showLocation(mapLocation) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;

                // Print GPS position to textarea
                logMessage(`Current Position -> Latitude: ${latitude}, Longitude: ${longitude}`);

                const point = this.mapLocation.getLocationOnMap(latitude, longitude);
                if (!point) {
                    return;
                }
                const { x, y } = point;
                const dot = document.getElementById('dot');
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

    async showCurrentLocation() {
        for (let i = 0; i < 10000000; i++) {
            // this.showLocation(mapLocation);
            console.log('Attempt to show current location');
            await doWait(10000);

        }
    }
}

// =================================================

class Coordinate {
    /**
     * @param {number} lat
     * @param {number} lng
     */
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

}
