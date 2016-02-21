'use strict';

/** Render functions used in engine.js game loop
 *  Exports:
 *      renderEntities: render player and enemies
 *      renderGameInformation: render score and timer
 *      renderGameGrid: render game tiles
 *      renderStartScreen: render start of game specific information
 *      renderGameOverScreen: render end of game specific information
 */

var resources = require('../utilities/resources');
var renderHelper = require('../utilities/render_helper');

var entities = require('../game_objects/instantiate_entities');
var score = require('../game_objects/score');
var timer = require('../game_objects/timer');

var canvas = require('../graphics_objects/canvas');
var startScreen = require('../graphics_objects/start_screen');
var gameOver = require('../graphics_objects/gameover_screen');

var ctx = canvas.ctx,
    player = entities.player,
    allEnemies = entities.allEnemies;


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
    timer.render(ctx);
}

function renderGameOverScreen() {
    renderHelper.setDefaultStyles(ctx);

    // Box around score and directions
    gameOver.renderRectangle(ctx);

    // Player's score
    gameOver.renderScoreText(ctx, score);

    // Directions to play again
    gameOver.renderDirections(ctx);

}



module.exports = {
    renderGameGrid: renderGameGrid,
    renderEntities: renderEntities,
    renderGameOverScreen: renderGameOverScreen,
    renderStartScreen: renderStartScreen,
    renderGameInformation: renderGameInformation,
};