(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/** Game engine
 *  Udacity Nanodegree Project 3 - Classic Arcade Game Clone
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
},{"./engine_logic/render":2,"./engine_logic/resets":3,"./engine_logic/state_checks":4,"./engine_logic/subscriptions":5,"./engine_logic/updates":6,"./game_objects/high_scores":9,"./game_objects/instantiate_entities":10,"./state_handling/event_listeners":18,"./state_handling/gamestate_handler":19,"./state_handling/state_pubsub":20,"./utilities/resources":24}],2:[function(require,module,exports){
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
},{"../game_objects/instantiate_entities":10,"../game_objects/score":11,"../game_objects/timer":12,"../graphics_objects/canvas":13,"../graphics_objects/gameover_screen":14,"../graphics_objects/start_screen":15,"../utilities/render_helper":23,"../utilities/resources":24}],3:[function(require,module,exports){
'use strict';

/** Used in init function of engine.js to reset elements back to defaults
 *
 *  Exports:
 *      resetEntities: reset the enemies to offscreen with new random y tile
 *          start and speed
 *      resetGameInformation: reset the score to 0 and time back to the time
 *          limit set in timer.js
 */


var score = require('../game_objects/score');
var timer = require('../game_objects/timer');
var entities = require('../game_objects/instantiate_entities');


function resetEntities() {
    entities.allEnemies.forEach(function(enemy) {
        enemy.resetSprite();
    });
}

function resetGameInformation() {
    score.reset();
    timer.reset();
}

module.exports = {
    resetGameInformation: resetGameInformation,
    resetEntities: resetEntities
};
},{"../game_objects/instantiate_entities":10,"../game_objects/score":11,"../game_objects/timer":12}],4:[function(require,module,exports){
'use strict';

/** State checks used in engine.js for collisions, player reaching water, timer
 *  states, and game state
 *
 *  Exported methods:
 *      checkCollisions:
 *          Detect player/enemy collisions and publishes to statePubSub
 *          Detect player reaching water and publishes to statePubSub
 *      checkTimer:
 *          Checks if time is up and publishes to statePubSub
*           Check for timer running low (see timer.render method - text turns
*           red when time is running out)
 *      isGameOver:
 *          Used in engine.js in rendering function to determine if game over
 *          screen should be rendered on top of each frame.
 */

var statePubSub = require('../state_handling/state_pubsub');
var collisionHandler = require('../state_handling/collision_handler');
var timer = require('../game_objects/timer');
var gameStateHandler = require('../state_handling/gamestate_handler');
var entities = require('../game_objects/instantiate_entities');

var player = entities.player,
    allEnemies = entities.allEnemies;


function checkCollisions() {
    collisionHandler.collisionCheck(allEnemies, player, statePubSub);
}

function checkTimer() {
    timer.checkForTimeUp(statePubSub);
    timer.checkForTimeRunningOut();
}

// Everything except the conditional rendering of the game over screen in game
// uses the statePubSub to monitor game state. The reason for not using a subscription
// is that the rendering of the end screen data occurs every loop over an actively
// rendering grid with enemies moving across it. It needs to be called more than the one time
// when the game state changes to game over.
function isGameOver() {
    if (gameStateHandler.getCurrentState() === 'gameOver') {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkCollisions: checkCollisions,
    checkTimer: checkTimer,
    isGameOver: isGameOver
};
},{"../game_objects/instantiate_entities":10,"../game_objects/timer":12,"../state_handling/collision_handler":17,"../state_handling/gamestate_handler":19,"../state_handling/state_pubsub":20}],5:[function(require,module,exports){
'use strict';

/** Set up subscriptions to statePubSub module for state change monitoring
 *  in engine.js
 *
 *  Export:
 *      setStateSubscriptions:
 *          Subscribe player to collisionOccured and timeIsUp
 *          Subscribe score to collisionOccured and playerReachedWater
 *          Subscribe highScores to scoreChange and timeIsUp
 *          Subscribe gameStateHandler to timeIsUp
 *          Subscribe eventListeners to gameStateChange
 */

var statePubSub = require('../state_handling/state_pubsub');
var gameStateHandler = require('../state_handling/gamestate_handler');
var entities = require('../game_objects/instantiate_entities');
var score = require('../game_objects/score');
var highScores = require('../game_objects/high_scores');
var eventListeners = require('../state_handling/event_listeners');


function setStateSubscriptions() {
    entities.player.subscribeToCollisionStatus(statePubSub);
    entities.player.subscribeToTimeIsUpStatus(statePubSub);

    score.subscribeToCollisionStatus(statePubSub);
    score.subscribeToPlayerInWaterStatus(statePubSub);

    highScores.subscribeToScoreChangeStatus(statePubSub);
    highScores.subscribeToTimeIsUpStatus(statePubSub);

    gameStateHandler.subscribeToTimeIsUp(statePubSub);

    eventListeners.subscribeToGameStateStatus(statePubSub);
}


module.exports = {
    setStateSubscriptions: setStateSubscriptions
}



},{"../game_objects/high_scores":9,"../game_objects/instantiate_entities":10,"../game_objects/score":11,"../state_handling/event_listeners":18,"../state_handling/gamestate_handler":19,"../state_handling/state_pubsub":20}],6:[function(require,module,exports){
'use strict';

/** Update functions used in engine.js each run of game loop
 *
 *  Exports:
 *      updateEntities: update location of enemies and player
 *      updateGameInformation: update timer
 *      (score is not updated here as it is handled in responses to published
 *      collisions and player reaching water)
 */


var entities = require('../game_objects/instantiate_entities');
var timer = require('../game_objects/timer');

var player = entities.player,
    allEnemies = entities.allEnemies;



function updateEntities(dt, statePubSub) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update(statePubSub);
}

function updateGameInformation() {
    timer.update();
}

module.exports = {
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation
};
},{"../game_objects/instantiate_entities":10,"../game_objects/timer":12}],7:[function(require,module,exports){
'use strict';

/** Enemy class
 *
 *  Properties: sprite (image file), startingX (coordinate), rightBoundary
 *  Methods: setStart, setSpeed, resetSprite, update, render
 *
 *  On instantiation, enemy is reset to random starting y with a random speed
 */

var landmarks = require('../utilities/landmarks.js'),
    resources = require('../utilities/resources.js');

// Enemies our player must avoid

var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';
    this.startingX = landmarks.xLeftSideOf.offScreenLeft;
    this.rightBoundary = landmarks.xLeftSideOf.offScreenRight;

    this.resetSprite(); // set at startingX and give random speed and y
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var updatedX = this.x + (this.speed * dt);

    if (updatedX > this.rightBoundary) {
        this.resetSprite();
    } else {
        this.x = updatedX;
    }

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(ctx) {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.setStart = function() {
    var possibleStarts = [
            landmarks.yEntityAdjust.stone1,
            landmarks.yEntityAdjust.stone2,
            landmarks.yEntityAdjust.stone3
    ];
    // Random generate 0, 1, or 2 to correspond to possibleStarts array indices
    var randomNumber = Math.floor(Math.random() * 3);
    var startLocation = possibleStarts[randomNumber];
    return startLocation;
};


Enemy.prototype.setSpeed = function() {
    var minSpeed = 50;
    var maxSpeed = 300;
    return minSpeed + Math.floor(Math.random() * maxSpeed);
};

Enemy.prototype.resetSprite = function() {
    this.x = this.startingX;
    this.y = this.setStart();
    this.speed = this.setSpeed();
};

module.exports = Enemy;
},{"../utilities/landmarks.js":22,"../utilities/resources.js":24}],8:[function(require,module,exports){
'use strict';

/** Player Class
 *
 *  Properties: sprite (image file)
 *  Methods: resetSprite, subscribeToCollisionStatus, subscribeToTimeIsUpStatus,
 *   update, render, handleInput
 *
 *  On instantiation, location is reset to starting tile
 *
 *  Subscriptions + subscriber funciton:
 *      collisionOccured: resetSprite
 *      timeIsUpStatus: resetSprite
 *
 *  Publishes:
 *      playerReachedWater
 */

var landmarks = require('../utilities/landmarks.js');
var resources = require('../utilities/resources.js');


var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.resetSprite();
};

Player.prototype.subscribeToCollisionStatus = function(statePubSub) {
    // bind Player object as 'this' for resetSprite
    var resetSpriteBound = this.resetSprite.bind(this);
    statePubSub.subscribe('collisionOccured', resetSpriteBound);
};


Player.prototype.subscribeToTimeIsUpStatus = function(statePubSub) {
    // bind Player object as 'this' for resetSprite
    var resetSpriteBound = this.resetSprite.bind(this);
    statePubSub.subscribe('timeIsUp', resetSpriteBound);
};


Player.prototype.resetSprite = function(){
    this.x = landmarks.xLeftSideOf.tile3;
    this.y = landmarks.yEntityAdjust.grass2;
};

Player.prototype.update = function(statePubSub) {
    var oneTileX = 101;
    var oneTileY = 83;

    if (this.moving === true) {
        if (this.nextMovement === 'left') {
            if (this.x > landmarks.boundaries.left) {
                this.x -= oneTileX;
            }
        } else if (this.nextMovement === 'right') {
            if (this.x < landmarks.boundaries.right) {
                this.x += oneTileX;
            }
        } else if (this.nextMovement === 'up') {
            if (this.y > landmarks.boundaries.top) {
                this.y -= oneTileY;
            } else {
                // This is so player moves slightly into water before being reset
                this.y -= 10;
                statePubSub.publishStateChange('playerReachedWater', statePubSub);
                this.resetSprite();
            }
        } else if (this.nextMovement === 'down') {
            if (this.y < landmarks.boundaries.bottom) {
                this.y += oneTileY;
            }
        }
    this.moving = false;
    }
};

Player.prototype.render = function(ctx) {
    ctx.drawImage(resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (keyCode) {
    this.moving = true;
    this.nextMovement = keyCode;
};


module.exports = Player;
},{"../utilities/landmarks.js":22,"../utilities/resources.js":24}],9:[function(require,module,exports){
'use strict';

/** High Scores object - Uses localStorage to persist high scores between game
 *   sessions for user in same browser. It does this by tracking the currentGameScore
 *   through a subscription to scoreChange. When it receives a timeIsUp state change
 *   through a subscription to timeIsUp, it pulls the high scores from local storage,
 *   compares current score them, updates high scores if necessary, pushes the updated
 *   high scores back to local storage, and then renders them to the DOM.
 *
 *  NOTE: Timer module has a mechanism to ensure that it only publishes the timeIsUp
 *  state change once. Otherwise, setHighScoreForGame and render methods would be called
 *  continuously after time ran out.
 *
 *  Exports:
 *      highScores object
 *
 *  Properties: currentScore
 *  Methods: updateCurrentScore, subcribeToScoreChangeStatus, pullFromStorage,
 *      pushToStorage, updateHighScore, getSortedStorageHighScores, setHighScoreForGame,
 *      render, subscribeToTimeIsUpStatus
 *
 *  Subscriptions + subscriber functions:
 *      scoreChange: updateCurrentScore
 *      timeIsUp: setHighScoreForGame, render
 */

var dataStorage = require('../utilities/datastorage.js');

/** Use local storage API to store high scores
 */

// Set high scores to default of 0 if not already set
if (! dataStorage.highScores) {
    dataStorage.highScores = [0, 0, 0, 0, 0];
}

// Helper functions

function stringToIntArray(data) {
    var tempHighScore = data.split(',');

    tempHighScore.map(function(score, index) {
        tempHighScore[index] = parseInt(score, 10);
    });

    return tempHighScore;
}

function compareNumbers(a, b) {
    return b - a;
}


var highScores = {
    // mirrors the currentScore in the score object through a subscription to score changes
    currentScore: 0,

    updateCurrentScore: function(gameCurrentScore) {
        this.currentScore = gameCurrentScore;
    },

    subscribeToScoreChangeStatus: function(statePubSub) {
        var updateCurrentScoreBound = this.updateCurrentScore.bind(this);

        statePubSub.subscribe('scoreChange', updateCurrentScoreBound);
    },

    pullFromStorage: function() {
        this.highScores = stringToIntArray(dataStorage.highScores);
    },

    pushToStorage: function() {
        dataStorage.highScores = this.highScores;
    },

    updateHighScore: function(currentScore) {
        var currentHighScores = this.highScores,
            minHighScore,
            minScoreIndex;

        // using Math.min.apply allows you to pass array of parameters to Math.min
        // Source: MDN Function.prototype.apply
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
        minHighScore = Math.min.apply(null, currentHighScores),
        minScoreIndex = currentHighScores.indexOf(minHighScore);

        if (currentScore > minHighScore) {
            currentHighScores[minScoreIndex] = currentScore;
        }

        this.highScores = currentHighScores;
    },

    getSortedStorageHighScores: function() {
        // localStorage returns a string which needs to be converted to array
        var savedHighScores = stringToIntArray(dataStorage.highScores);
        savedHighScores.sort(compareNumbers); // sort descending by amount
        return savedHighScores;
    },

    // Steps to pull high scores from local storage, update them in temp var, then
    // push back new high scores to local storage
    setHighScoreForGame: function() {
            this.pullFromStorage();
            this.updateHighScore(this.currentScore);
            this.pushToStorage();
    },

    render: function() {
        var currentHighScores = this.getSortedStorageHighScores(),
            scoreListItem;

        for (var i = 0; i < currentHighScores.length; i++) {
            scoreListItem = document.querySelector('.score-' + i);
            scoreListItem.innerText = currentHighScores[i];
        }
    },

    subscribeToTimeIsUpStatus: function(statePubSub) {
        var setHighScoreForGameBound = this.setHighScoreForGame.bind(this),
            renderBound = this.render.bind(this);

        statePubSub.subscribe('timeIsUp', setHighScoreForGameBound);
        statePubSub.subscribe('timeIsUp', renderBound);
    },

};


module.exports = highScores;
},{"../utilities/datastorage.js":21}],10:[function(require,module,exports){
'use strict';

/** Instantiate player and 3 enemies (enemy instances are put into allEnemies array)
 *
 *  Exports:
 *      allEnemies: array of enemy instances
 *      player: player instance
 */

var Enemy = require('./Enemy.js');
var Player = require('./Player.js');

var allEnemies,
    player;

allEnemies = [];
for (var i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}

player = new Player();

module.exports = {
   allEnemies: allEnemies,
   player: player
};


},{"./Enemy.js":7,"./Player.js":8}],11:[function(require,module,exports){
'use strict';

/** Score module - tracks current score, adjusts score in response to collisions
 *      and player reaching water
 *
 *  Exports:
 *       getCurrentScore: returns _currentScore
 *       reset: set _currentScore to 0
 *       render: render "Score: " and _currentScore to canvas
 *       subscribeToPlayerInWaterStatus: set subscription
 *       subscribeToCollisionStatus: set subscription
 *
 *  Subscriptions + subscriber function:
 *      playerInWater: scoreUp (calls _changeScore with 'up' as parameter)
 *      collisionOccured: scoreDown (calls _changeScore with 'down' as a parameter)
 *
 *  Publishes:
 *      scoreChange (also passes _currentScore to statePubSub to be relayed to
 *          subscribers)
 *
 */

var renderHelper = require('../utilities/render_helper.js');
var landmarks = require('../utilities/landmarks.js');
var canvas = require('../graphics_objects/canvas.js');


var _currentScore = 0,
    _scoreUpAmount = 100,
    _scoreDownAmount = 50,
    _heading = {
        text: 'Score: ',
        x: landmarks.xLeftSideOf.tile1 + 10,
        y: landmarks.yTopOf.water + 50
    },

    _scoreText = {
        fillerSpace: ' ',
        x: landmarks.xLeftSideOf.tile2 + 10,
        y: landmarks.yTopOf.water + 50
    },

    _highlightedGreen = false,
    _highlightedRed = false,

    _scoreUpStyles = {
        fillStyle: 'green',
        font: '45px "Bangers"'
    },

    _scoreDownStyles = {
        fillStyle: 'red',
        font: '45px "Bangers"'
    };


function getCurrentScore() {
    return _currentScore;
}

function reset () {
    _currentScore = 0;
}

function subscribeToCollisionStatus(statePubSub) {
    statePubSub.subscribe('collisionOccured', _scoreDown);

}

function subscribeToPlayerInWaterStatus(statePubSub) {
    statePubSub.subscribe('playerReachedWater', _scoreUp);
}

function _scoreUp(statePubSub) {
     _changeScore('up', statePubSub);
}

function _scoreDown(statePubSub) {
    _changeScore('down', statePubSub);
}

function _changeScore(directionOfChange, statePubSub) {

    if (directionOfChange === 'up') {
        _currentScore += _scoreUpAmount;

        statePubSub.publishStateChange('scoreChange', _currentScore);

        _highlightedGreen = true;
        // Green score flash and larger font for 350ms
        window.setTimeout(function() {
            _highlightedGreen = false;
        }, 350);

    } else if (directionOfChange === 'down') {
        _currentScore -= _scoreDownAmount;

        statePubSub.publishStateChange('scoreChange', _currentScore);

        _highlightedRed = true;
        // Red score flash and larger font for 350ms
        window.setTimeout(function() {
            _highlightedRed = false;
        }, 350);
    }
}

function render() {

    canvas.ctx.strokeText(_heading.text, _heading.x, _heading.y);
    canvas.ctx.fillText(_heading.text, _heading.x, _heading.y);

    // Highlighted green and red properties toggled in update method
    // when score changes
    if (_highlightedGreen === true) {
        renderHelper.setNewContext(canvas.ctx, _scoreUpStyles);
    } else if (_highlightedRed === true) {
        renderHelper.setNewContext(canvas.ctx, _scoreDownStyles);
    }

    // Add extra space for positive so that negatives don't seem to shift
    // over to the right with negative sign
    if (_currentScore >= 0) {
        canvas.ctx.strokeText(_scoreText.fillerSpace + _currentScore, _scoreText.x, _scoreText.y);
        canvas.ctx.fillText(_scoreText.fillerSpace + _currentScore, _scoreText.x, _scoreText.y);
    } else {
        canvas.ctx.strokeText(_currentScore, _scoreText.x, _scoreText.y);
        canvas.ctx.fillText(_currentScore, _scoreText.x, _scoreText.y);
    }
}



module.exports = {
    getCurrentScore: getCurrentScore,
    reset: reset,
    render: render,
    subscribeToPlayerInWaterStatus: subscribeToPlayerInWaterStatus,
    subscribeToCollisionStatus: subscribeToCollisionStatus,

};
},{"../graphics_objects/canvas.js":13,"../utilities/landmarks.js":22,"../utilities/render_helper.js":23}],12:[function(require,module,exports){
'use strict';

/** Timer module - tracks time left in game and publishes when time has run out
 *
 *  NOTE: The module must internally track if _timeIsUp is true or false. The
 *          checkForTimeUp function will only publish the result when timeLeft.amount is
 *          0 and _timeIsUp is false. Once the timeIsUp state is published, _timeIsUp is
 *          set to true. By doing this, you avoid the timeIsUp state being continously
 *          published once the timer hits 0.
 *
 *  Exports:
 *      update: stops timer is _timeLeft = 0
 *      render: render "Timer: " and _timeLeft to canvas
 *      reset: set _timeLeft.amount to _timeLimit, resets local timeIsUp and timeRunningOut to false,
 *          starts timer
 *      checkForTimeRunningOut: publishes timeIsUp when _timeLeft = 0, sets local
 *          timeIsUp to true to ensure it is only called once
 *      checkForTimeRunningOut: sets timeIsRunningOut to true when _timeLeft.amount < 5000
 *
 *  Publishes:
 *      timeIsUp
 */

var renderHelper = require('../utilities/render_helper.js'),
    landmarks = require('../utilities/landmarks.js'),
    canvas = require('../graphics_objects/canvas.js');

var _timeRunningOutStyles = {
        fillStyle: 'red'
    },

    _timeLimit = 30000,

    _heading = {
        text: 'Timer: ',
        x: landmarks.xLeftSideOf.tile4 + 20,
        y: landmarks.yTopOf.water + 50
    },

    _timeLeft = {
        // amount property is set in method: setUpTimeLeft
        x: landmarks.xLeftSideOf.tile5 + 20,
        y: landmarks.yTopOf.water + 50
    },

    // Determine if the rendered time is red to indicate time is running out.
    _timeRunningOut = false,

    // Important to ensure that timeIsUp is only published once
    _timeIsUp = false,

    // Will be initialized to value of a window.setInterval
    _timerInterval;

// We want _timeLimit be the only place where the game time limit is set
function _setUpTimeLeft() {
    _timeLeft.amount = _timeLimit;
}

function _startTimer() {
    _timerInterval = window.setInterval(function(){
            _timeLeft.amount -= 1000;
    }, 1000);
}

function _stopTimer() {
    window.clearInterval(_timerInterval);
}

function reset() {
    _setUpTimeLeft();
    _timeIsUp = false;
    _timeRunningOut = false;
    _startTimer();
}

function checkForTimeUp(statePubSub) {
    if (_timeLeft.amount === 0 && _timeIsUp === false) {
        _timeIsUp = true;
        // passing statePubSub as argument so that it can be passed to
        // gameStateHandler.toGameOver, which needs to publish the gameState change
        // through the statePubSub object
        statePubSub.publishStateChange('timeIsUp', statePubSub);
    }
}

function checkForTimeRunningOut() {
    if (_timeLeft.amount <= 5000) {
        _timeRunningOut = true;
    }
}

function update() {
    if (_timeIsUp) {
        _stopTimer();
    }
}

function render() {
    var timeLeftInSeconds = _timeLeft.amount / 1000;
    canvas.ctx.strokeText(_heading.text, _heading.x, _heading.y);
    canvas.ctx.fillText(_heading.text, _heading.x, _heading.y);

    // when time is almost out, make the time left red
    if (_timeRunningOut) {
        renderHelper.setNewContext(canvas.ctx, _timeRunningOutStyles);
    }

    canvas.ctx.strokeText(timeLeftInSeconds, _timeLeft.x, _timeLeft.y);
    canvas.ctx.fillText(timeLeftInSeconds, _timeLeft.x, _timeLeft.y);

}


module.exports = {
    update: update,
    render: render,
    reset: reset,
    checkForTimeUp: checkForTimeUp,
    checkForTimeRunningOut: checkForTimeRunningOut,
};
},{"../graphics_objects/canvas.js":13,"../utilities/landmarks.js":22,"../utilities/render_helper.js":23}],13:[function(require,module,exports){
'use strict';

/** Canvas - creates canvas element, sets up 2d context, and appends to body
 *
 *  Exports:
 *      height: canvas height
 *      width: canvas width
 *      context: canvas 2d context
 */

var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    canvasHolder = document.querySelector('.canvas-holder');

canvas.width = 505;
canvas.height = 606;

canvasHolder.appendChild(canvas);

module.exports = {
    height: canvas.height,
    width: canvas.width,
    ctx: ctx
};

},{}],14:[function(require,module,exports){
'use strict';

/** Object containing styles and text for game over screen overlay
 *
 *  Properties: scoreTextStyle, directionsStyle, rectFillStyle, scoreText, directions,
 *      rectangle
 *  Methods: renderRectangle, renderScoreText, renderDirections
 *
 */

var renderHelper = require('../utilities/render_helper.js'),
    canvas = require('../graphics_objects/canvas.js');


var gameOver = {

    // Default style overrides (see renderhelper.js function setNewContext,
    // which takes an object of named context styles as a param)
    scoreTextStyle: {
        font: '36px "Bangers"',
        textAlign: 'center',
        fillStyle: '#000'
    },

    directionsStyle: {
        font: '24px "Bangers"',
        fillStyle: '#000'
    },

    rectFillStyle: {
        fillStyle: 'rgba(255, 255, 255, 0.75)'
    },

    scoreText: {
        start: 'You scored ',
        end: ' points!',
        x: canvas.width/2,
        y: canvas.height/2
    },

    directions: {
        text: 'To play again press Enter',
        x: canvas.width/2,
        y: canvas.height/2 + 100
    },

    rectangle: {
        width: 400,
        height: 300,
        x: 50,
        y: 200
    },

    renderRectangle: function(ctx) {
        renderHelper.setNewContext(ctx, this.rectFillStyle);
        ctx.fillRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
    },

    // Expect a score object with property currentScore
    renderScoreText: function(ctx, score) {
        var scoreTextFull = this.scoreText.start + score.getCurrentScore() + this.scoreText.end;

        renderHelper.setNewContext(ctx, this.scoreTextStyle);
        ctx.fillText(scoreTextFull, this.scoreText.x, this.scoreText.y);
    },

    renderDirections: function(ctx) {
        renderHelper.setNewContext(ctx, this.directionsStyle);
        ctx.fillText(this.directions.text, this.directions.x, this.directions.y);
    }

};

module.exports = gameOver;
},{"../graphics_objects/canvas.js":13,"../utilities/render_helper.js":23}],15:[function(require,module,exports){
'use strict';

/** Object containing styles and text for start screen
 *
 *  Properties: headingStyle, subHeadingStyle, startDirectionsStyle, mainHeading,
 *      subHeading, directions, player, enemy
 *  Methods: renderHeading, renderSubHeading, renderDirections, renderPlayer,
 *      renderEnemies
 */

var renderHelper = require('../utilities/render_helper.js'),
    resources = require('../utilities/resources.js'),
    landmarks = require('../utilities/landmarks.js');

var startScreen = {

    // Default style overrides (see renderhelper.js function setNewContext,
    // which takes an object of named styles as a param)

    headingStyle: {
        font: '30px "Bangers"'
    },

    subHeadingStyle: {
        font: '24px "Bangers"'
    },

    startDirectionStyle: {
        font: '30px "Bangers'
    },

    // Start Screen Elements with coordinates

    mainHeading: {
        text: 'Crossing the Road',
        x: landmarks.xLeftSideOf.tile1 + 5,
        y: landmarks.yTopOf.canvasTop + 40,
    },

    subHeading: {
        text: 'Into the Water for Some Reason',
        x: landmarks.xLeftSideOf.tile2 + 50,
        y: landmarks.yTopOf.water + 60,
        rotation: -2 * Math.PI / 180
    },

    directions: [
        {
            text: 'Press',
            x: landmarks.xLeftSideOf.tile2 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'Enter',
            x: landmarks.xLeftSideOf.tile3 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'To',
            x: landmarks.xLeftSideOf.tile4 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'Start',
            x: landmarks.xLeftSideOf.tile2 + 10,
            y: landmarks.yTopOf.grass2 + 50
        },
        {
            text: 'Game',
            x: landmarks.xLeftSideOf.tile3 + 10,
            y: landmarks.yTopOf.grass2 + 50
        }
    ],


    player: {
        sprite: 'images/char-boy.png',
        x: landmarks.xLeftSideOf.tile5,
        y: landmarks.yEntityAdjust.stone2
    },

    enemy: {
        sprite: 'images/enemy-bug.png',
        coordinates: [
            { x: landmarks.xLeftSideOf.tile2, y: landmarks.yEntityAdjust.stone1 },
            { x: landmarks.xLeftSideOf.tile3, y: landmarks.yEntityAdjust.stone2 },
            { x: landmarks.xLeftSideOf.tile2, y: landmarks.yEntityAdjust.stone3 }
        ]
    },


    renderHeading: function(ctx) {
        renderHelper.setNewContext(ctx, this.headingStyle);
        ctx.fillText(this.mainHeading.text, this.mainHeading.x, this.mainHeading.y);
    },

    renderSubHeading: function(ctx) {
        renderHelper.setNewContext(ctx, this.subHeadingStyle);
        ctx.rotate(this.subHeading.rotation);
        ctx.fillText(this.subHeading.text, this.subHeading.x, this.subHeading.y);
        ctx.resetTransform();
    },

    // Layout of directions on start screen:
    //
    // Press Enter To
    // Start Game

    renderDirections: function(ctx) {
        renderHelper.setNewContext(ctx, this.startDirectionStyle);
        for (var i = 0; i < this.directions.length; i++) {
            ctx.fillText(this.directions[i].text, this.directions[i].x, this.directions[i].y);
            }
    },

    renderPlayer: function(ctx) {
        ctx.drawImage(resources.get(this.player.sprite), this.player.x, this.player.y);
    },

    renderEnemies: function(ctx) {
        for (var i = 0; i < 3; i++) {
            ctx.drawImage(resources.get(this.enemy.sprite), this.enemy.coordinates[i].x, this.enemy.coordinates[i].y);
        }
    }
};

module.exports = startScreen;
},{"../utilities/landmarks.js":22,"../utilities/render_helper.js":23,"../utilities/resources.js":24}],16:[function(require,module,exports){
'use strict';

/** Event Handler Class - used to instantiate event listener objects. An instance
 *      has a listener function, an event type, and can have a callback assigned to it
 *      for the listener to invoke when the event is triggered. The object can
 *      turn the event listener it stores on and off.
 *
 *  Properties: eventType, listener (function)
 *  Methods: setListenerCallback, turnOnEventListener, turnOffEventListener
 */


// listener function should take callback param that it will conditionally invoke
// ex: function listener(callback) { if (conditionMet) { callback() }
var EventHandler = function(eventType, listener) {
    this.eventType = eventType;
    this.listener = listener;
};

// set a wrapper function that takes a callback as a param
// the wrapper's job is to invoke the listener function with callback argument
EventHandler.prototype.setListenerCallback = function(callback) {
    var that = this;
    that.wrapper = function() {
        that.listener(callback);
    };
};

// wrapper is passed to addEventListener
// when event is triggered, the wrapper calls listener(callback)
// the listener makes a condition check and if met invokes the callback
EventHandler.prototype.turnOnEventListener = function() {
    var that = this;
    this.onOffState = 'on';
    document.addEventListener(that.eventType, that.wrapper);
};

// We can now pass this.wrapper to removeEventListener to turn off the eventlistener
EventHandler.prototype.turnOffEventListener = function() {
    var that = this;
    this.onOffState = 'off';
    document.removeEventListener(that.eventType, that.wrapper);
};


module.exports = EventHandler;
},{}],17:[function(require,module,exports){
'use strict';

/** Collision handling - monitors player and enemy coordinate for collisions and
 *  publishes if occurs
 *
 *  Exports:
 *      collisionCheck: publishes collisionOccured when enemy and player coordinates
 *          overlap
 *
 *  Publishes:
 *      collisionOccured
 */

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
},{}],18:[function(require,module,exports){
'use strict';

/** Event listeners module - instantiate Event Handler objects with listener functions
 *      in module. An eventListenerToggle function turns the event listeners on and off
 *      depending on the gameState.
 *
 * Exports:
 *      pressEnterToStart: Event Handler object with eventlistenr for enter key press
 *      arrowsMovePlayer: Event Handler object with eventlistner for arrow keys
 *      subscribeToGameStateStatus: set subscription to gameState
 *
 * Subscriptions + subsciber function:
 *      gameState: eventListenerToggle
 *
 */

var EventHandler = require('../state_handling/Event_handler');

var pressEnterToStart,
    arrowsMovePlayer;

// Will receive the game loop function init as the argument in engine.js
function enterToStart(callback) {
    if (window.event.keyCode === 13) {
        callback();
    }
}

// Listen for arrow key presses and pass to player method handleInput
function handleArrowKeysToMove(callback) {
    var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

    callback(allowedKeys[window.event.keyCode]);
}

// Instantiate event listeners with appropriate event type and listener
pressEnterToStart = new EventHandler('keyup', enterToStart);
arrowsMovePlayer = new EventHandler('keyup', handleArrowKeysToMove);


function eventListenerToggle(currentGameState) {
    if (currentGameState === 'gamePlay') {
        pressEnterToStart.turnOffEventListener();
        arrowsMovePlayer.turnOnEventListener();
    } else if (currentGameState === 'startScreen' || currentGameState === 'gameOver') {
        pressEnterToStart.turnOnEventListener();
        arrowsMovePlayer.turnOffEventListener();
    }
}

function subscribeToGameStateStatus(statePubSub) {
    statePubSub.subscribe('gameStateChange', eventListenerToggle);
}

module.exports = {
    pressEnterToStart: pressEnterToStart,
    arrowsMovePlayer: arrowsMovePlayer,
    subscribeToGameStateStatus: subscribeToGameStateStatus
};
},{"../state_handling/Event_handler":16}],19:[function(require,module,exports){
'use strict';

/** Gamestate Handler module - stores current gamestate (_currentState) from a
 *      list of available states and has functions that change _currentState and
 *      publish it
 *
 *  Exports:
 *      toStartScreen: change _currentState to startScreen and publish
 *      toGamePlay: change _currentState to gamePlay and publish
 *      toGameOver: change _currentState to gameOver and publish
 *      getCurrentState: return _currentState
 *      subscribeToTimeIsUp: set subscription to timeIsUp
 *
 *  Subscriptions + subscriber function:
 *      timeIsUp: toGameOver (when timeIsUp, gameState needs to be change to gameOver)
 *
 *  Publishes:
 *      gameStateChange (each gameState conversion publishes this state change and
 *      passes the new _currentState to statePubSub to relay to subscribers)
 */

var _availableStates = {
        startScreen: 'startScreen',
        gamePlay: 'gamePlay',
        gameOver: 'gameOver'
    },
    _currentState;

function toStartScreen(statePubSub) {
    _currentState = _availableStates.startScreen;
    statePubSub.publishStateChange('gameStateChange', _currentState);
}

function toGamePlay(statePubSub){
    _currentState = _availableStates.gamePlay;
    statePubSub.publishStateChange('gameStateChange', _currentState);
}

function toGameOver(statePubSub){
    _currentState = _availableStates.gameOver;
    statePubSub.publishStateChange('gameStateChange', _currentState);
}

function getCurrentState() {
    return _currentState;
}


function subscribeToTimeIsUp(statePubSub) {
    statePubSub.subscribe('timeIsUp', toGameOver);
}

module.exports = {
    toGameOver: toGameOver,
    toGamePlay: toGamePlay,
    toStartScreen: toStartScreen,
    getCurrentState: getCurrentState,
    subscribeToTimeIsUp: subscribeToTimeIsUp
};
},{}],20:[function(require,module,exports){
'use strict';

/** State Publish-Subscribe coordination module
 *
 * Module/object publishes a state change to statePubSub
 * statePubSub then iterates over array of subscriber functions and calls each
 *
 * Example:
 * collision_handler.js detects collision between player and enemy so it publishes
 *  this to statePubSub as a collisionOccured state change
 * The subscribers list includes player.resetSprite and the score module's scoreDown
 * statePubSub iterates over the collisionOccured subscribers array, calling each function
 * The result is the player spirte is reset and the score is decreased
 *
 * States: timeIsUp, collisionOccured, playerReachedWater, scoreChange, gameStateChange
 *
 * Exports:
 *      publishStateChange: called by object publishing a state change, it iterates
 *          over subscribers array for that state, calling each subscriber function
 *          Has an optional value parameter which can be used to pass data from the
 *          publisher to subscriber
 *      subscribe: called by subscriber, it pushes the subscribing function to the
 *          subscribers list of the requested state
 *          Returns an object with unsubscribe method. The object has closure over
 *          the index at which the subscriber function was placed in the subscriber array
 */

var _states = {
    timeIsUp: {
        subscribers: []
    },
    collisionOccured: {
        subscribers: []
    },
    playerReachedWater: {
        subscribers: []
    },
    scoreChange: {
        subscribers: []
    },
    gameStateChange: {
        subscribers: []
    },
};


function publishStateChange(state, value) {
    _states[state].subscribers.forEach(function(func){
        if (value !== undefined) {
            func(value);
        } else {
            func();
        }

    });
}

// Concept of returning an object with remove method that can access the index of the function
// in the subscribers array came from David Walsh Blog example
// https://davidwalsh.name/pubsub-javascript
function subscribe(state, func) {
    var indexOfFunction;

    if (_states[state]) {
        _states[state].subscribers.push(func);
        indexOfFunction = _states[state].subscribers.length - 1
    }

    // When setting the subscription, an object with unsubscribe method is returned
    return {
        unsubscribe: function() {
            _states[state].subscribers.splice(indexOfFunction, 1);
        }
    }
}


module.exports = {
    publishStateChange: publishStateChange,
    subscribe: subscribe,
};




},{}],21:[function(require,module,exports){
'use strict';

/** Local storage access point for game/
 *  Will be used to store high scores
 */

// Set dataStorage to the global localStorage
var dataStorage = localStorage;

module.exports = dataStorage;
},{}],22:[function(require,module,exports){
'use strict';

/** Mapping of some commonly used coordinates in rendering of various game elements for convenience
*
*   Representation of landmarks on the canvas
*   Game Grid
*   OS = Offscreen / T = Tile / E = Enemy / P = Player
*         OS  T1  T2  T3  T4  T5   OS
*            ---------------------
* water      |   |   |   |   |   |
*            ---------------------
* stone1  E  |   |   |   |   |   |
*            ---------------------
* stone2  E  |   |   |   |   |   |
*            ---------------------
* stone3  E  |   |   |   |   |   |
*            ---------------------
* grass1     |   |   |   |   |   |
*            ---------------------
* grass2     |   |   | P |   |   |
*            ---------------------
*
* Exports:
*   xLeftSideOf: x coordinates for left side of each tile as well as offscreen left
*               and right
*   yTopOf: y coordinates for top of canvas and top of tiles
*   yEntityAdjust: y coordinates with adjustment to place enemies and player in them
*   boundaries: 4 side boundaries for player movement x and y coordinates
**/

    // left sides of tiles
var xLeftSideOf = {
        offScreenLeft: -101,
        tile1: 0,
        tile2: 101,
        tile3: 202,
        tile4: 303,
        tile5: 404,
        offScreenRight: 505
    },

    // upper side of tiles
    yTopOf = {
        canvasTop: 0,
        water: 50,
        stone1: 133,
        stone2: 216,
        stone3: 299,
        grass1: 382,
        grass2: 465
    },

    // Y coordinates for enemies and player to appear in proper place in specified game tile
    // The sprites have empty space above them in some cases as part of image
    yEntityAdjust = {
        water: 0,
        stone1: 60,
        stone2: 143,
        stone3: 226,
        grass1: 309,
        grass2: 392
    },

    // Movement boundaries
    boundaries = {
        top: 60,
        right: 404,
        bottom: 392,
        left: 0
    }


module.exports = {
    xLeftSideOf: xLeftSideOf,
    yTopOf: yTopOf,
    yEntityAdjust: yEntityAdjust,
    boundaries: boundaries
};
},{}],23:[function(require,module,exports){
'use strict';

/** Default Styles
 *  Helpers to set the default styles and set new styles for the context
 *
 *  Idea is to have a default styling for all canvas rendering
 *  Individual render functions can selectively override portions of default styles
 *  as well as easily restore default style.
 *
 *  Exports:
 *      setNewContext: accepts an object with context style key value pairs and iterates
 *          over the object assigning each each style value to the equivalent context
 *          style property
 *      setDefaultStyles: set the styles in the defaultStyles object
 */


var defaultStyles = {
    textAlign: 'left',
    font: '36px "Bangers"',
    fillStyle: '#000',
    strokeStyle: '#fff',
    lineWidth: 2.5
};

function setNewContext(ctx, stylingObject) {
    for (var style in stylingObject) {
        if (stylingObject.hasOwnProperty(style)) {
            ctx[style] = stylingObject[style];
        }
    }
}

function setDefaultStyles(ctx) {
    setNewContext(ctx, defaultStyles);
}


module.exports = {
    setNewContext: setNewContext,
    setDefaultStyles: setDefaultStyles
};
},{}],24:[function(require,module,exports){
'use strict';

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */

    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    /* This is the publicly accessible image loading function. It accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly.
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            /* If the developer passed in an array of images
             * loop through each value and call our image
             * loader on that image file
             */
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the image's src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    module.exports = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };


},{}]},{},[1]);
