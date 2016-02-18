var gameEls = require('./gameelements');
var collisions = require('./handlers/collisionhandler');
var EventHandler = require('./handlers/eventhandler');
var gameState = require('./gameelements/gamestate');
var eventListeners = require('./handlers/eventlisteners');
var stateTracker = require('./handlers/statetracker');



var score = gameEls.score,
    player = gameEls.player,
    allEnemies = gameEls.allEnemies,
    gameTimer = gameEls.gameTimer,
    highScores = gameEls.highScores;

// Instantiate event listeners with appropriate event type and listener
var pressEnterToStart = new EventHandler('keyup', eventListeners.enterToStart),
    arrowsMovePlayer = new EventHandler('keyup', eventListeners.handleArrowKeysToMove);

function toggleEventListeners() {
    var currentState = gameState.getCurrentState(),
        arrowListenerState = arrowsMovePlayer.reportOnOffState(),
        enterListenerState = pressEnterToStart.reportOnOffState();

    // Only want to toggle the listeners if in correct game state and
    // have not yet turned the appropriate listener on
    if ((currentState === 'gamePlay') && (arrowListenerState === 'off')) {
        pressEnterToStart.turnOffEventListener();
        arrowsMovePlayer.turnOnEventListener();
    } else if ((currentState === 'startScreen' || currentState === 'gameOver') &&
                enterListenerState === 'off') {
        pressEnterToStart.turnOnEventListener();
        arrowsMovePlayer.turnOffEventListener();
    }

}
// Collision detection - toggles collision states in player object if collision occurs
function checkCollisions() {
    collisions.collisionCheck(allEnemies, player, stateTracker);
    collisions.playerReachedWaterCheck(player, stateTracker);
}

// Checks to see if time has run out and toggles game state if time is up
function checkTimer() {
    gameTimer.checkForTimeUp(stateTracker);
    gameTimer.checkForTimeRunningOut();
    // if (gameTimer.isTimeUp() === true) {
    //     gameState.togameOver();
    // }
}

// Check for game over at start of main loop to determine if game over state events
// need to be initiated
function isGameOver() {
    if (gameState.getCurrentState() === 'gameOver') {
        return true;
    } else {
        return false;
    }
}

// Perform updates on game element information based on changes since last frame
function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
        enemy.update(dt);
    });
    player.update();
    if (isGameOver()) {
        player.resetSprite();
    }
}

function updateGameInformation() {
    gameTimer.update();
    score.update();
}


// Check for High Score being set for this game
function highScoreHasBeenSet() {
    return highScores.hasBeenCalledForGame();
}

// Steps to pull high scores from local storage, update them in temp var, then
// push back new high scores to local storage
function setHighScoreForGame() {
    highScores.pullFromStorage();
    highScores.updateHighScore(score.currentScore);
    highScores.pushToStorage();
    highScores.setAsCalledForGame();
}

// Resets per game

function resetGameInformation() {
    score.reset();
    gameTimer.reset();
    highScores.resetCalledStatus();
    // collisions.reset(player);

}


// Clean ups per frame
function resetPlayerCollisionStatuses() {
    // collisions.reset(player);
    stateTracker.resetStates();

}

module.exports = {
    pressEnterToStart: pressEnterToStart,
    arrowsMovePlayer: arrowsMovePlayer,
    toggleEventListeners: toggleEventListeners,
    checkCollisions: checkCollisions,
    checkTimer: checkTimer,
    isGameOver: isGameOver,
    updateEntities: updateEntities,
    updateGameInformation: updateGameInformation,
    highScoreHasBeenSet: highScoreHasBeenSet,
    setHighScoreForGame: setHighScoreForGame,
    resetGameInformation: resetGameInformation,
    resetPlayerCollisionStatuses: resetPlayerCollisionStatuses,
};