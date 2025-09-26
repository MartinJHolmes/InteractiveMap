class MapLocation {
    constructor(topLeft, bottomRight, width, height) {
    this.topLeft = topLeft;         // expects { lat: ..., lng: ... }
    this.bottomRight = bottomRight; // expects { lat: ..., lng: ... }
    this.width = width;
    this.height = height;
  }

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