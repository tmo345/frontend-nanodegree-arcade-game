var landmarks = require('../utilities/landmarks.js');

var collisionHandler = {

    checkEnemyPlayerCollision: function(enemies, player) {

        var occupySameX,
            occupySameY,
            enemyPlayerCollided;

        enemies.forEach(function(enemy) {
            occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
            occupySameY = enemy.y === player.y;
            enemyPlayerCollided = occupySameX && occupySameY;

            if (enemyPlayerCollided) {
                player.toggleCollisionStatus();
            }
        });
    },

    checkPlayerInWater: function(player) {
        var playerInTheWater = player.y < landmarks.boundaries.top;

        if (playerInTheWater) {
            player.togglePlayerInWaterStatus();
        }
    },

};

module.exports = collisionHandler;