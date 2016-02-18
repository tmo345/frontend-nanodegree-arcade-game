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

function toStartScreen() {
    _currentState = _availableStates.startScreen;
}

function toGamePlay(){
    _currentState = _availableStates.gamePlay;
}

function toGameOver(){
    _currentState = _availableStates.gameOver;
}

function getCurrentState() {
    return _currentState;
}

// function checkForGameOver(timer) {
//     if (timer.timeIsUp === true) {
//         togameOver();
//     }
// }

function subscribeToGameOver(stateTracker) {
    var boundToGameOver = this.toGameOver.bind(this);
    stateTracker.subscribe('timeIsUp', boundToGameOver);
}

module.exports = {
    toGameOver: toGameOver,
    toGamePlay: toGamePlay,
    toStartScreen: toStartScreen,
    // checkForGameOver: checkForGameOver,
    getCurrentState: getCurrentState,
    subscribeToGameOver: subscribeToGameOver
};