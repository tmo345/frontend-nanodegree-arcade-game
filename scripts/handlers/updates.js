var app = require('../app.js');

function stateChecks() {
    collisions.checkEnemyPlayerCollision(allEnemies, player);
    collisions.checkPlayerInWater(player);

    if (app.gameTimer.isTimeUp() === true) {
        app.gameStateManager.toEndScreen();
    }
}

function updateEntities(dt) {
    app.allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    app.player.update();
}

function updateGameInformation() {
    app.gameTimer.update();
    app.score.update(app.player);
}

module.exports = {
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation
};