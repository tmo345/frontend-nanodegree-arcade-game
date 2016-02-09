/**
 * Need to keep an up to date central reference for the various states of
 * importantce to the game.
 * States:
 *      timer: time Up
 *      collisions: player collided with enemy, player in water
 *      gamestate: startscreen, gameplay, endscreen(gameover)
 */

var _states = {
    timeIsUp: {
        status: false,
        subscribers: []
    },
    collisionOccured: {
        status: false,
        subscribers: []
    },
    playerReachedWater: {
        status: false,
        subscribers: []
    },
    gameOver: {
        status: false,
        subscribers: []
    }
};



// function publishStateChange(state) {
//     _states[state] = true;

// }

function publishStateChange(state) {
    _states[state].subscribers.forEach(function(func){
        func();
    });
}

function subscribe(state, func) {
    if (_states[state]) {
        _states[state].subscribers.push(func);
    } else {
        throw new _SubscribeException(state);
    }
}

function resetStates() {
    _states.collisionOccured.state = false;

}

function _SubscribeException(incorrectState) {
    this.incorrectState = incorrectState;
    this.message = 'The state ' + this.incorrectState + ' you are trying to subscribe to does not exist. Try: timeIsUp, collisionOccured, playerReachedWater, or gameOver.';
}

module.exports = {
    // publishStateChange: publishStateChange,
    // requestState: requestState,
    resetStates: resetStates,
    publishStateChange: publishStateChange,
    subscribe: subscribe
};



