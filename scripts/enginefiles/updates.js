var app = require('../app.js');

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
    updateScore();
}

function updateScore() {
    var playerInTheWater = player.getInWaterStatus(),
        playerCollidedWithEnemy = player.getCollisionStatus();

    if (playerInTheWater) {
        score.update('up');
    } else if (playerCollidedWithEnemy) {
        score.update('down');
    }
}

module.exports = {
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation
};