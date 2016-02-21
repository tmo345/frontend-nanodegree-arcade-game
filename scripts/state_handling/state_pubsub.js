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



