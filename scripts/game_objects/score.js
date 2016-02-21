'use strict';

/** Score module - tracks current score, adjusts score in response to collisions
 *      and player reaching water
 *
 *  Exports:
 *       getCurrentScore: returns _currentScore
 *       reset: set _currentScore to 0
 *       render: render "Score: " and _currentScore to canvas
 *       subscribeToPlayerInWaterStatus: set subscription
 *       subscribeToCollisionStatus: set subscription
 *
 *  Subscriptions + subscriber function:
 *      playerInWater: scoreUp (calls _changeScore with 'up' as parameter)
 *      collisionOccured: scoreDown (calls _changeScore with 'down' as a parameter)
 *
 *  Publishes:
 *      scoreChange (also passes _currentScore to statePubSub to be relayed to
 *          subscribers)
 *
 */

var renderHelper = require('../utilities/render_helper.js');
var landmarks = require('../utilities/landmarks.js');
var canvas = require('../graphics_objects/canvas.js');


var _currentScore = 0,
    _scoreUpAmount = 100,
    _scoreDownAmount = 50,
    _heading = {
        text: 'Score: ',
        x: landmarks.xLeftSideOf.tile1 + 10,
        y: landmarks.yTopOf.water + 50
    },

    _scoreText = {
        fillerSpace: ' ',
        x: landmarks.xLeftSideOf.tile2 + 10,
        y: landmarks.yTopOf.water + 50
    },

    _highlightedGreen = false,
    _highlightedRed = false,

    _scoreUpStyles = {
        fillStyle: 'green',
        font: '45px "Bangers"'
    },

    _scoreDownStyles = {
        fillStyle: 'red',
        font: '45px "Bangers"'
    };


function getCurrentScore() {
    return _currentScore;
}

function reset () {
    _currentScore = 0;
}

function subscribeToCollisionStatus(statePubSub) {
    statePubSub.subscribe('collisionOccured', _scoreDown);

}

function subscribeToPlayerInWaterStatus(statePubSub) {
    statePubSub.subscribe('playerReachedWater', _scoreUp);
}

function _scoreUp(statePubSub) {
     _changeScore('up', statePubSub);
}

function _scoreDown(statePubSub) {
    _changeScore('down', statePubSub);
}

function _changeScore(directionOfChange, statePubSub) {

    if (directionOfChange === 'up') {
        _currentScore += _scoreUpAmount;

        statePubSub.publishStateChange('scoreChange', _currentScore);

        _highlightedGreen = true;
        // Green score flash and larger font for 350ms
        window.setTimeout(function() {
            _highlightedGreen = false;
        }, 350);

    } else if (directionOfChange === 'down') {
        _currentScore -= _scoreDownAmount;

        statePubSub.publishStateChange('scoreChange', _currentScore);

        _highlightedRed = true;
        // Red score flash and larger font for 350ms
        window.setTimeout(function() {
            _highlightedRed = false;
        }, 350);
    }
}

function render() {

    canvas.ctx.strokeText(_heading.text, _heading.x, _heading.y);
    canvas.ctx.fillText(_heading.text, _heading.x, _heading.y);

    // Highlighted green and red properties toggled in update method
    // when score changes
    if (_highlightedGreen === true) {
        renderHelper.setNewContext(canvas.ctx, _scoreUpStyles);
    } else if (_highlightedRed === true) {
        renderHelper.setNewContext(canvas.ctx, _scoreDownStyles);
    }

    // Add extra space for positive so that negatives don't seem to shift
    // over to the right with negative sign
    if (_currentScore >= 0) {
        canvas.ctx.strokeText(_scoreText.fillerSpace + _currentScore, _scoreText.x, _scoreText.y);
        canvas.ctx.fillText(_scoreText.fillerSpace + _currentScore, _scoreText.x, _scoreText.y);
    } else {
        canvas.ctx.strokeText(_currentScore, _scoreText.x, _scoreText.y);
        canvas.ctx.fillText(_currentScore, _scoreText.x, _scoreText.y);
    }
}



module.exports = {
    getCurrentScore: getCurrentScore,
    reset: reset,
    render: render,
    subscribeToPlayerInWaterStatus: subscribeToPlayerInWaterStatus,
    subscribeToCollisionStatus: subscribeToCollisionStatus,

};