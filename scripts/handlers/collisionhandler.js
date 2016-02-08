var landmarks = require('../utilities/landmarks.js');


var _collisionHasOccured = false,
    _playerReachedWater = false;

// enemies: array of Enemy instances with x and y properties
// player: instance of Player with x and y properties
function collisionCheck(enemies, player) {

    var occupySameX,
        occupySameY,
        enemyPlayerCollided;

    enemies.forEach(function(enemy) {
        occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
        occupySameY = enemy.y === player.y;
        enemyPlayerCollided = occupySameX && occupySameY;
        if (enemyPlayerCollided === true) {
            _collisionHasOccured = true;
        }
    });
}

// player: instance of Player with y property
function playerReachedWaterCheck(player) {
    var playerInTheWater = player.y < landmarks.boundaries.top;
    if (playerInTheWater === true) {
        _playerReachedWater = true;
    }
}

function reset() {
    _collisionHasOccured = false;
    _playerReachedWater = false;
}

function collisionOccured() {
    return _collisionHasOccured;
}

function playerReachedWater() {
    return _playerReachedWater;
}

module.exports = {
    collisionCheck: collisionCheck,
    playerReachedWaterCheck: playerReachedWaterCheck,
    reset: reset,
    collisionOccured: collisionOccured,
    playerReachedWater: playerReachedWater

};



// var landmarks = require('../utilities/landmarks.js');

// var collisionHandler = {

//     _collisionHasOccured: false,
//     _playerReachedWater: false,

//     // enemies: array of Enemy instances with x and y properties
//     // player: instance of Player with x and y properties
//     //          and toggleCollisionStatus method
//     collisionCheck: function(enemies, player) {

//         var occupySameX,
//             occupySameY,
//             enemyPlayerCollided;

//         enemies.forEach(function(enemy) {
//             occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
//             occupySameY = enemy.y === player.y;
//             enemyPlayerCollided = occupySameX && occupySameY;
//             if (enemyPlayerCollided === true) {
//                 this._collisionHasOccured = true;
//             }
//         });
//     },

//     // player: instance of Player with togglePlayerInWaterStatus method
//     inWaterCheck: function(player) {
//         var playerInTheWater = player.y < landmarks.boundaries.top;
//         if (playerInTheWater) {
//             this.playerReachedWater = true;
//         }
//     },

//     reset: function() {
//         this.collisionHasOccured = false;
//         this.playerReachedWater = false;
//     },

//     get collisionHasOccured() {
//         console.log('it workedsort of');
//         return this._collisionHasOccured; },
//     get waterStatus() { return this.playerReachedWater }

// };


// module.exports = {
//     collisionCheck: collisionHandler.collisionCheck.bind(collisionHandler),
//     inWaterCheck: collisionHandler.inWaterCheck.bind(collisionHandler),
//     reset: collisionHandler.reset.bind(collisionHandler),
//     playerReachedWater: collisionHandler.collisionStatus.bind(collisionHandler),
//     collisionHasOccured: collisionHandler.collisionHasOccured.bind(collisionHandler)
// };