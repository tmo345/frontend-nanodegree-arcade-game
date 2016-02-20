'use strict';

/** Set up subscriptions to statePubSub module for state change monitoring
 *  in engine.js
 *
 *  Exported method:
 *      setStateSubscriptions:
 *          Subscribe player and score to collisionStatus and playerInWater Status.
 *          Subscribe gameStateHandler to timeIsUp status.
 */

var statePubSub = require('../state_handling/state_pubsub');
var gameStateHandler = require('../state_handling/gamestate_handler');
var entities = require('../game_objects/instantiate_entities');
var score = require('../game_objects/score');
var highScores = require('../game_objects/high_scores');
var eventListeners = require('../state_handling/event_listeners');


function setStateSubscriptions() {
    highScores.subscribeToScoreChangeStatus(statePubSub);
    highScores.subscribeToTimeIsUpStatus(statePubSub);

    entities.player.subscribeToCollisionStatus(statePubSub);
    entities.player.subscribeToTimeIsUpStatus(statePubSub);

    score.subscribeToCollisionStatus(statePubSub);
    score.subscribeToPlayerInWaterStatus(statePubSub);

    eventListeners.subscribeToGameStateStatus(statePubSub);

    gameStateHandler.subscribeToTimeIsUp(statePubSub);
}


module.exports = {
    setStateSubscriptions: setStateSubscriptions
}


