/** Mapping of some commonly used coordinates in rendering of various game elements for convenience
*
*   Representation of landmarks on the canvas
*   Game Grid
*   OS = Offscreen / T = Tile / E = Enemy / P = Player
*         OS  T1  T2  T3  T4  T5   OS
*            ---------------------
* water      |   |   |   |   |   |
*            ---------------------
* stone1  E  |   |   |   |   |   |
*            ---------------------
* stone2  E  |   |   |   |   |   |
*            ---------------------
* stone3  E  |   |   |   |   |   |
*            ---------------------
* grass1     |   |   |   |   |   |
*            ---------------------
* grass2     |   |   | P |   |   |
*            ---------------------
**/

var landmarks = {

    // left sides of tiles
    xLeftSideOf: {
        offScreenLeft: -101,
        tile1: 0,
        tile2: 101,
        tile3: 202,
        tile4: 303,
        tile5: 404,
        offScreenRight: 505
    },

    // upper side of tiles
    yTopOf: {
        canvasTop: 0,
        water: 50,
        stone1: 133,
        stone2: 216,
        stone3: 299,
        grass1: 382,
        grass2: 465
    },

    // Y coordinates for enemies and player to appear in proper place in specified game tile
    // The sprites have empty space above them in some cases
    yEntityAdjust: {
        water: 0,
        stone1: 60,
        stone2: 143,
        stone3: 226,
        grass1: 309,
        grass2: 392
    },

    // Movement boundaries
    boundaries: {
        top: 60,
        right: 404,
        bottom: 392,
        left: 0
    }

};

module.exports = landmarks;