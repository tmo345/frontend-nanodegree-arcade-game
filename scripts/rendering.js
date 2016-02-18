var gameEls = require('./gameelements');
var canvas = require('./rendering/canvas');
var resources = require('./utilities/resources');
var renderHelper = require('./rendering/renderhelper');
var startScreen = require('./rendering/startscreen');
var gameOver = require('./rendering/gameover');

// Convenience declarations to cut down on lots of something.something.something.n. calls
var ctx = canvas.ctx,
    score = gameEls.score,
    player = gameEls.player,
    allEnemies = gameEls.allEnemies,
    gameTimer = gameEls.gameTimer,
    highScores = gameEls.highScores;

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

    // Set default styles which will be selectively overriden in each startScreen method
    renderHelper.setDefaultStyles(ctx);

    // Render headings
    startScreen.renderHeading(ctx);
    startScreen.renderSubHeading(ctx);

    // Render directions
    startScreen.renderDirections(ctx);

    // Render sprites
    startScreen.renderPlayer(ctx);
    startScreen.renderEnemies(ctx);
}

function renderEntities() {

    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
        enemy.render(ctx);
    });

    player.render(ctx);
}

function renderGameInformation() {
    renderHelper.setDefaultStyles(ctx);
    score.render(ctx);

    renderHelper.setDefaultStyles(ctx);
    gameTimer.render(ctx);
}

function renderGameOver() {
    renderHelper.setDefaultStyles(ctx);

    // Box around score and directions
    gameOver.renderRectangle(ctx);

    // Player's score
    gameOver.renderScoreText(ctx, score);

    // Directions to play again
    gameOver.renderDirections(ctx);

}

function renderHighScores() {
    var currentHighScores = highScores.getSortedStorageHighScores(),
        scoreListItem;

    for (var i = 0; i < currentHighScores.length; i++) {
        scoreListItem = document.querySelector('.score-' + i);
        scoreListItem.innerText = currentHighScores[i];
    }
}

module.exports = {
    renderGameGrid: renderGameGrid,
    renderEntities: renderEntities,
    renderGameOver: renderGameOver,
    renderStartScreen: renderStartScreen,
    renderGameInformation: renderGameInformation,
    renderHighScores: renderHighScores,
    ctx: ctx
};