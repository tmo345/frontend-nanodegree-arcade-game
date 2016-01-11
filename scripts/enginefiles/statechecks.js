var app = require('../app.js');

    // Class instances
var player = app.player,
    allEnemies = app.allEnemies,
    timer = app.timer,
    gameStateManager = app.gameStateManager;

// Check for collision and toggle collision status if collision detected
function checkEnemyPlayerCollision() {
    var occupySameX,
        occupySameY,
        enemyPlayerCollided;

    allEnemies.forEach(function(enemy) {
        occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
        occupySameY = enemy.y === player.y;
        enemyPlayerCollided = occupySameX && occupySameY;

        if (enemyPlayerCollided) {
            player.toggleCollisionStatus();
        }
    });
}

// Check for player in water and toggle player in water status if detected
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

module.exports = {
    checkEnemyPlayerCollision: checkEnemyPlayerCollision,
    checkPlayerInWater: checkPlayerInWater,
    checkTimerForEnd: checkTimerForEnd
};