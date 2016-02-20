'use strict';

// TODO: In game as it currently stands, the most important game state change is
// to the gameOver. The mechanism to distinguish between startScreen and
// gamePlay are present as well and the state changes accordingy as the game
// flows. Plan to have features that use all the states such as having options
// on the start screen like character choosing. The change back to startScreen
// would be signficant in order to bring user to the start screen to choose a
// new character if desired.

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