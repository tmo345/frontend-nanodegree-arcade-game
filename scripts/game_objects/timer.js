'use strict';

/** Timer module - tracks time left in game and publishes when time has run out
 *
 *  NOTE: The module must internally track if _timeIsUp is true or false. The
 *          checkForTimeUp function will only publish the result when timeLeft.amount is
 *          0 and _timeIsUp is false. Once the timeIsUp state is published, _timeIsUp is
 *          set to true. By doing this, you avoid the timeIsUp state being continously
 *          published once the timer hits 0.
 *
 *  Exports:
 *      update: stops timer is _timeLeft = 0
 *      render: render "Timer: " and _timeLeft to canvas
 *      reset: set _timeLeft.amount to _timeLimit, resets local timeIsUp and timeRunningOut to false,
 *          starts timer
 *      checkForTimeRunningOut: publishes timeIsUp when _timeLeft = 0, sets local
 *          timeIsUp to true to ensure it is only called once
 *      checkForTimeRunningOut: sets timeIsRunningOut to true when _timeLeft.amount < 5000
 *
 *  Publishes:
 *      timeIsUp
 */

var renderHelper = require('../utilities/render_helper.js'),
    landmarks = require('../utilities/landmarks.js'),
    canvas = require('../graphics_objects/canvas.js');

var _timeRunningOutStyles = {
        fillStyle: 'red'
    },

    _timeLimit = 30000,

    _heading = {
        text: 'Timer: ',
        x: landmarks.xLeftSideOf.tile4 + 20,
        y: landmarks.yTopOf.water + 50
    },

    _timeLeft = {
        // amount property is set in method: setUpTimeLeft
        x: landmarks.xLeftSideOf.tile5 + 20,
        y: landmarks.yTopOf.water + 50
    },

    // Determine if the rendered time is red to indicate time is running out.
    _timeRunningOut = false,

    // Important to ensure that timeIsUp is only published once
    _timeIsUp = false,

    // Will be initialized to value of a window.setInterval
    _timerInterval;

// We want _timeLimit be the only place where the game time limit is set
function _setUpTimeLeft() {
    _timeLeft.amount = _timeLimit;
}

function _startTimer() {
    _timerInterval = window.setInterval(function(){
            _timeLeft.amount -= 1000;
    }, 1000);
}

function _stopTimer() {
    window.clearInterval(_timerInterval);
}

function reset() {
    _setUpTimeLeft();
    _timeIsUp = false;
    _timeRunningOut = false;
    _startTimer();
}

function checkForTimeUp(statePubSub) {
    if (_timeLeft.amount === 0 && _timeIsUp === false) {
        _timeIsUp = true;
        // passing statePubSub as argument so that it can be passed to
        // gameStateHandler.toGameOver, which needs to publish the gameState change
        // through the statePubSub object
        statePubSub.publishStateChange('timeIsUp', statePubSub);
    }
}

function checkForTimeRunningOut() {
    if (_timeLeft.amount <= 5000) {
        _timeRunningOut = true;
    }
}

function update() {
    if (_timeIsUp) {
        _stopTimer();
    }
}

function render() {
    var timeLeftInSeconds = _timeLeft.amount / 1000;
    canvas.ctx.strokeText(_heading.text, _heading.x, _heading.y);
    canvas.ctx.fillText(_heading.text, _heading.x, _heading.y);

    // when time is almost out, make the time left red
    if (_timeRunningOut) {
        renderHelper.setNewContext(canvas.ctx, _timeRunningOutStyles);
    }

    canvas.ctx.strokeText(timeLeftInSeconds, _timeLeft.x, _timeLeft.y);
    canvas.ctx.fillText(timeLeftInSeconds, _timeLeft.x, _timeLeft.y);

}


module.exports = {
    update: update,
    render: render,
    reset: reset,
    checkForTimeUp: checkForTimeUp,
    checkForTimeRunningOut: checkForTimeRunningOut,
};