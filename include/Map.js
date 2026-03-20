export class MyMap {
    constructor() {
        this.zoomLevel = 1;
        this.currentMap = 0;
    }

    /**
     * @param {number} mapId
     */
    loadMapContents(mapId) {
        this.loadNewMap(mapId);
        console.log(`load map: ${mapId}`);

    }

    loadNewMap(mapId) {
        const mapContainer = document.getElementById('mapContainer');
        mapContainer.getElementsByTagName('img').item(0).src = 'images/valencia.jpg';
    }


}