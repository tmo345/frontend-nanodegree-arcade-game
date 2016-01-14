var canvas = require('../utilities/canvas.js'),
    app = require('../app.js'),
    resources = require('../utilities/resources.js'),
    grid = require('../utilities/grid.js');

var ctx = canvas.ctx,
    canvasHeight = canvas.canvasHeight,
    canvasWidth = canvas.canvasWidth,
    score = app.score,
    player = app.player,
    allEnemies = app.allEnemies,
    timer = app.timer,
    highScores = app.highScores,
    gem = app.gem;


function renderGameGrid() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
        numRows = 6,
        numCols = 5,
        row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            /* The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * We're using our Resources helpers to refer to our images
             * so that we get the benefits of caching these images, since
             * we're using them over and over.
             */
            ctx.drawImage(resources.get(rowImages[row]), col * 101, row * 83);
        }
    }
}


function renderStartScreen() {
    // Game grid
    renderGameGrid();

    // Title
    ctx.font = '30px "Bangers"';
    ctx.fillText('Crossing the Road', 5, 40);

    // Subtitle - rotated
    ctx.font = '24px "Bangers"';
    ctx.rotate(-2 * Math.PI / 180);
    ctx.fillText('Into The Water for Some Reason', 150, 110);
    ctx.resetTransform();

    // Instructions
    ctx.font = '30px "Bangers"';
    ctx.fillText('Press', grid.x.tile2 + 10, grid.y.grass1 + 125);
    ctx.fillText('Enter', grid.x.tile3 + 10, grid.y.grass1 + 125);
    ctx.fillText('To', grid.x.tile4 + 10, grid.y.grass1 + 125);
    ctx.fillText('Start', grid.x.tile2 + 10, grid.y.grass2 + 125);
    ctx.fillText('Game', grid.x.tile3 + 10, grid.y.grass2 + 125);

    // Draw player and bugs
    ctx.drawImage(resources.get('images/char-boy.png'), grid.x.tile5, grid.y.stone2);
    ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile2, grid.y.stone1);
    ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile3, grid.y.stone2);
    ctx.drawImage(resources.get('images/enemy-bug.png'), grid.x.tile2, grid.y.stone3);
}

/* This function is called by the render function and is called on each game
 * tick. Its purpose is to then call the render functions you have defined
 * on your enemy and player entities within app.js
 */
function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    player.render();
}

function renderGameInformation() {
    score.render();
    timer.render();
}

function renderEndScreen() {
    var scoreText = 'You scored ' + score.score + ' points!',
        playAgainText = 'To play again: press enter';

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillRect(50, 200, 400, 300);

    ctx.font = '36px "Bangers"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText(scoreText, canvasWidth/2, canvasHeight/2);
    ctx.font = '24px "Bangers"';
    ctx.fillText(playAgainText, canvasWidth/2, (canvasHeight/2 + 100));
}

function renderHighScores() {
    var currentHighScores = highScores.getSortedStorageHighScores(),
        scoreListItem;

    for (var i = 0; i < currentHighScores.length; i++) {
        scoreListItem = document.querySelector('.score-' + i);
        scoreListItem.innerText = currentHighScores[i];
    }
}

function renderGem() {
    if (!gem.drawn) {
        gem.selectRandomCoordinate();
        gem.drawn = true;
    }
    ctx.drawImage(resources.get(gem.sprite), gem.x, gem.y, 50, 50);


}

module.exports = {
    renderGameGrid: renderGameGrid,
    renderEntities: renderEntities,
    renderEndScreen: renderEndScreen,
    renderStartScreen: renderStartScreen,
    renderGameInformation: renderGameInformation,
    renderHighScores: renderHighScores,
    renderGem: renderGem
};