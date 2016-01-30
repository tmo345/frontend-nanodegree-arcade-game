var app = require('../app.js');


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