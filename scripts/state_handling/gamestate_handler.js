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