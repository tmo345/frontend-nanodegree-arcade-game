var gameStateManager = {

    availableStates: {
        startScreen: 'startScreen',
        gamePlay: 'gamePlay',
        endScreen: 'endScreen'
    },

    toStartScreen: function() {
        this.currentState = this.availableStates.startScreen;
    },

    toGamePlay: function(){
        this.currentState = this.availableStates.gamePlay;
    },

    toEndScreen: function(){
        this.currentState = this.availableStates.endScreen;
    },

    getCurrentState: function() {
        return this.currentState;
    }
};

module.exports = gameStateManager;