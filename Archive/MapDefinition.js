export class MapDefinition {
    /**
     * @param {Coordinate} topLeft;
     * @param {Coordinate} bottomRight;
     * @param {number} width;
     * @param {number} height;
     */
    constructor(topLeft, bottomRight, width, height) {
    this.topLeft = topLeft;         // expects { lat: ..., lng: ... }
    this.bottomRight = bottomRight; // expects { lat: ..., lng: ... }
    this.width = width;
    this.height = height;
  }

    /**
     * @param {number} lat; 
     * @param {number} lng; 
     */
    getLocationOnMap(lat, lng) {
        // Linear interpolation to convert GPS to pixel coordinates
        const x = ((lng - this.topLeft.lng) / (this.bottomRight.lng - this.topLeft.lng)) * this.width;
        const y = ((lat - this.topLeft.lat) / (this.bottomRight.lat - this.topLeft.lat)) * this.height;

        if(x < 0 || x > this.width) {
            console.log(`Not on map!!`);
            return null;
        }

        if(y < 0 || y > this.height) {
            console.log(`Not on map!!`);
            return null;
        }

        return { x, y };
    }
}


export class Coordinate {
    /**
     * @param {number} lat; 
     * @param {number} lng; 
     */
    constructor(lat,lng) {
        this.lat = lat;
        this.lng = lng;
    }
}