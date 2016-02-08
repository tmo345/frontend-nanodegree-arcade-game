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