var landmarks = require('../utilities/landmarks.js');

var collisionHandler = {

    // enemies: array of Enemy instances with x and y properties
    // player: instance of Player with x and y properties
    //          and toggleCollisionStatus method
    checkEnemyPlayerCollision: function(enemies, player) {

        var occupySameX,
            occupySameY,
            enemyPlayerCollided,
            collisionHasOccured = false;

        enemies.forEach(function(enemy) {
            occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
            occupySameY = enemy.y === player.y;
            enemyPlayerCollided = occupySameX && occupySameY;
            // console.log(enemyPlayerCollided);
            if (enemyPlayerCollided === true) {
                // console.log('hit, you sunk my battle ship!');
                collisionHasOccured = true;
            }
        });

        return collisionHasOccured;
    },

    // player: instance of Player with togglePlayerInWaterStatus method
    checkPlayerInWater: function(player) {
        var playerInTheWater = player.y < landmarks.boundaries.top;

        if (playerInTheWater) {
            player.togglePlayerInWaterStatus();
        }
    },

};

module.exports = collisionHandler;