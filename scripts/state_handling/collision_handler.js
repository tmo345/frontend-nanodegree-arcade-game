// enemies: array of Enemy instances with x and y properties
// player: instance of Player with x and y properties
function collisionCheck(enemies, player, statePubSub) {

    var occupySameX,
        occupySameY,
        enemyPlayerCollided;

    enemies.forEach(function(enemy) {
        occupySameX = (enemy.x + 96) >= (player.x + 17) && enemy.x <= (player.x + 83);
        occupySameY = enemy.y === player.y;
        enemyPlayerCollided = occupySameX && occupySameY;
        if (enemyPlayerCollided === true) {
            statePubSub.publishStateChange('collisionOccured', statePubSub);
        }
    });
}

module.exports = {
    collisionCheck: collisionCheck,
};