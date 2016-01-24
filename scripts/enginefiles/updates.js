var app = require('../app.js'),
    canvas = require('../gamedata/canvas.js');

    // Class instances
var player = app.player,
    allEnemies = app.allEnemies,
    score = app.score;

function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update();
}

function updateGameInformation() {
    app.gameTimer.update();
    updateScore();
}

function updateScore() {
    var playerInTheWater = player.getInWaterStatus(),
        playerCollidedWithEnemy = player.getCollisionStatus();

    if (playerInTheWater) {
        score.update('up', 100);
    } else if (playerCollidedWithEnemy) {
        score.update('down', 100);
    }
}

module.exports = {
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation
};