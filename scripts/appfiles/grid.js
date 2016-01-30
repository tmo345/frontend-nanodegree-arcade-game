// Representation of landmarks on the canvas

// Game Grid
// OS = Offscreen / T = Tile / E = Enemy / P = Player
//          OS  T1  T2  T3  T4  T5
//  water      |   |   |   |   |   |
//  stone1  E  |   |   |   |   |   |
//  stone2  E  |   |   |   |   |   |
//  stone3  E  |   |   |   |   |   |
//  grass1     |   |   |   |   |   |
//  grass2     |   |   | P |   |   |

var grid = {
        x: {
            offScreen: -101,
            tile1: 0,
            tile2: 101,
            tile3: 202,
            tile4: 303,
            tile5: 404
        },
        y: {
            water: 0,
            stone1: 60,
            stone2: 143,
            stone3: 226,
            grass1: 309,
            grass2: 392
        }
    };

module.exports = grid;