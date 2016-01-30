var canvas = require('../gamedata/canvas.js'),
    app = require('../app.js'),
    resources = require('../utilities/resources.js'),
    renderHelper = require('../utilities/renderhelper.js'),
    startScreen = require('../gamedata/startscreen.js'),
    endScreen = require('../gamedata/endscreen.js'),
    landmarks = require('../utilities/landmarks.js'),
    grid = require('../gamedata/grid.js');

var ctx = canvas.ctx,
    canvasHeight = canvas.canvasHeight,
    canvasWidth = canvas.canvasWidth,
    score = app.score,
    player = app.player,
    allEnemies = app.allEnemies,
    gameTimer = app.gameTimer,
    highScores = app.highScores;
    // gem = app.gem;


function renderGameGrid(ctx) {

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


function renderStartScreen(ctx) {

    // Game grid
    renderGameGrid(ctx);

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
    score.render(canvas.ctx);
    gameTimer.render(canvas.ctx);
}

function renderEndScreen(ctx) {
    renderHelper.setDefaultStyles(ctx);

    // Box around score and directions
    endScreen.renderRectangle(ctx);

    // Player's score
    endScreen.renderScoreText(ctx, app.score);

    // Directions to play again
    endScreen.renderDirections(ctx);

}

function renderHighScores() {
    var currentHighScores = highScores.getSortedStorageHighScores(),
        scoreListItem;
    console.log(currentHighScores);

    for (var i = 0; i < currentHighScores.length; i++) {
        scoreListItem = document.querySelector('.score-' + i);
        scoreListItem.innerText = currentHighScores[i];
    }
}

// function renderGem() {
//     if (!gem.drawn) {
//         gem.selectRandomCoordinate();
//         gem.drawn = true;
//     }
//     ctx.drawImage(resources.get(gem.sprite), gem.x, gem.y, 50, 50);


// }

module.exports = {
    renderGameGrid: renderGameGrid,
    renderEntities: renderEntities,
    renderEndScreen: renderEndScreen,
    renderStartScreen: renderStartScreen,
    renderGameInformation: renderGameInformation,
    renderHighScores: renderHighScores,
    // renderGem: renderGem
};