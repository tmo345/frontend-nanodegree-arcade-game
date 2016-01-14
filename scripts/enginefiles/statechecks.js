var app = require('../app.js');

    // Class instances
var player = app.player,
    allEnemies = app.allEnemies,
    timer = app.timer,
    gem = app.gem,
    gameStateManager = app.gameStateManager;


function checkPlayerEnemyCollided() {
    var collisionOccured = checkEntitiesCollided(allEnemies, player);
    if (collisionOccured) {
        player.toggleCollisionStatus();
    }
}

function checkPlayerOverGem() {
    var collisionOccured = checkEntitiesCollided(gem, player);
    if (collisionOccured) {
        player.toggleOverGemStatus();
    }

}

function checkPlayerInWater() {
    var playerInTheWater = player.y < player.topBoundary;

    if (playerInTheWater) {
        player.togglePlayerInWaterStatus();
    }
}

function checkTimerForEnd() {
    if (timer.timeLimit === 0) {
        timer.stopTimer();
        gameStateManager.toEndScreen();
    }
}


/*  Helper functions
 *
 */



function checkEntitiesCollided(entityA, entityB) {
    var collisionOccured;

    if (entityA instanceof Array) { // entity A is array of objects
        entityA.forEach(function(entity) {
            collisionOccured = occupySameSpace(entity, entityB);
        });
    } else { // entityA is a single object
        collisionOccured = occupySameSpace(entityA, entityB);
    }
    return collisionOccured;
}

function occupySameSpace(entityA, entityB) {
    var occupySameX,
        occupySameY;

    occupySameX = (entityA.x + 96) >= (entityB.x + 17) && entityA.x <= (entityB.x + 83);
    occupySameY = entityA.y === entityB.y;
    return occupySameX && occupySameY;
}

module.exports = {
    checkPlayerEnemyCollided: checkPlayerEnemyCollided,
    checkPlayerInWater: checkPlayerInWater,
    checkPlayerOverGem: checkPlayerOverGem,
    checkTimerForEnd: checkTimerForEnd
};