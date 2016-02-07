var gameState = {

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
    },

    // // expect timer object with method isTimUp
    // isGameOver: function(timer) {
    //     if (timer.isTimeUp() === true) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // },



};

module.exports = gameState;