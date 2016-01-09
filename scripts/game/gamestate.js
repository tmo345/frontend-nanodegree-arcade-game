var GameStateManager = function() {
    this.availableStates = {
        startScreen: 'startScreen',
        gamePlay: 'gamePlay',
        endScreen: 'endScreen'
    };
    // default state at instantiation is startScreen
    this.currentState = this.availableStates.startScreen;
};

GameStateManager.prototype.toStartScreen = function(){
    this.currentState = this.availableStates.startScreen;
};

GameStateManager.prototype.toGamePlay = function(){
    this.currentState = this.availableStates.gamePlay;
};


GameStateManager.prototype.toEndScreen = function(){
    this.currentState = this.availableStates.endScreen;
};

GameStateManager.prototype.getCurrentState = function() {
    return this.currentState;
};

module.exports = GameStateManager;