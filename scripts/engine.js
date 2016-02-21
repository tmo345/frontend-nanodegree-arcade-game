'use strict';

/** Game engine
 *  Udacity Nanodegree Project 3 - Classic Arcade Game Clone
 *  Timothy Moore
 *
 *  See README for details about the basic flow of the game engine
 */

var resources = require('./utilities/resources');
var render = require('./engine_logic/render');
var stateChecks = require('./engine_logic/state_checks');
var subscriptions = require('./engine_logic/subscriptions');
var entities = require('./game_objects/instantiate_entities');
var gameStateHandler = require('./state_handling/gamestate_handler');
var statePubSub = require('./state_handling/state_pubsub');
var highScores = require('./game_objects/high_scores');
var eventListeners = require('./state_handling/event_listeners');
var updates = require('./engine_logic/updates');
var resets = require('./engine_logic/resets');


var lastTime;

/* Load entity and image assets
*/
resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
]);

/* On loading of the images, build the start screen
*/
resources.onReady(buildStartScreen);

/* Set up eventlistener callbacks
 * press enter: init
 * press arrows: player.handleInput
 */
eventListeners.pressEnterToStart.setListenerCallback(init);
eventListeners.arrowsMovePlayer.setListenerCallback(entities.player.handleInput.bind(entities.player));

/* The most important part of the engine is the handling of object/module interaction
 * by using a publish-subscribe pattern. Objects reporting state changes publish to
 * statePubSub module and objects monitoring for state changes subscribe to each state
 * through the statePubSub module
 *
 * See subscriptions.js for details about subscriptions
 * README also has details about the relationships between the publishers and subscribers
 */
subscriptions.setStateSubscriptions();

/* Game loop is initiated when the pressEnterToStart event listener calls init
 * Init includes the first call to main to start the loop
 */
function main() {

    /* Time delta information needed for smooth animation
     */
    var now = Date.now(),
        dt = (now - lastTime) / 1000.0;


    stateChangeHandling();
    update(dt, statePubSub);
    rendering();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    window.requestAnimationFrame(main);
}

/* Builds the initial start screen on page load
 */
function buildStartScreen(ctx) {
    gameStateHandler.toStartScreen(statePubSub);

    highScores.render();
    render.renderGameGrid(ctx);
    render.renderStartScreen(ctx);

}

/* This function does some initial setup that should only occur once,
 * particularly setting the lastTime variable that is required for the
 * game loop.
 */
function init() {
    gameStateHandler.toGamePlay(statePubSub);
    reset();
    lastTime = Date.now();
    // Start the game loop
    main();
}

// Game loop updates
function update(dt) {
    updates.updateEntities(dt, statePubSub);
    updates.updateGameInformation(statePubSub);
}

// State change detection
function stateChangeHandling() {
    stateChecks.checkTimer();
    stateChecks.checkCollisions();
}

// Game loop rendering and gameOverScreen rendering
function rendering(ctx) {
    render.renderGameGrid(ctx);
    render.renderEntities();
    render.renderGameInformation();
    // If game is over, will continue render grid, entities, and information,
    // but the end screen information will overlay it
    if (stateChecks.isGameOver() === true) {
        render.renderGameOverScreen(ctx);
    }
}

// Reset score, timer, and enemies
// Called once on init
function reset() {
    resets.resetGameInformation();
    resets.resetEntities();
}