/**
 * Need to keep an up to date central reference for the various states of
 * importantce to the game.
 * States:
 *      timer: time Up
 *      collisions: player collided with enemy, player in water
 *      gamestate: startscreen, gameplay, gameover
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



