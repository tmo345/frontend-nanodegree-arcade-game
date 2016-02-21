'use strict';

/** Set up subscriptions to statePubSub module for state change monitoring
 *  in engine.js
 *
 *  Export:
 *      setStateSubscriptions:
 *          Subscribe player to collisionStatus and timeIsUpStatus
 *          Subscribe score to collisionStatus and playerInWaterStatus
 *          Subscribe highScores to scoreChangeStatus and timeIsUpStatus
 *          Subscribe gameStateHandler to timeIsUp status
 *          Subscribe eventListeners to gameStateChangeStatus
 */

var statePubSub = require('../state_handling/state_pubsub');
var gameStateHandler = require('../state_handling/gamestate_handler');
var entities = require('../game_objects/instantiate_entities');
var score = require('../game_objects/score');
var highScores = require('../game_objects/high_scores');
var eventListeners = require('../state_handling/event_listeners');


function setStateSubscriptions() {
    entities.player.subscribeToCollisionStatus(statePubSub);
    entities.player.subscribeToTimeIsUpStatus(statePubSub);

    score.subscribeToCollisionStatus(statePubSub);
    score.subscribeToPlayerInWaterStatus(statePubSub);

    highScores.subscribeToScoreChangeStatus(statePubSub);
    highScores.subscribeToTimeIsUpStatus(statePubSub);

    gameStateHandler.subscribeToTimeIsUp(statePubSub);

    eventListeners.subscribeToGameStateStatus(statePubSub);
}


module.exports = {
    setStateSubscriptions: setStateSubscriptions
}


