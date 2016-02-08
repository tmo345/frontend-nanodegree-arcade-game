var renderHelper = require('../rendering/renderhelper.js'),
    landmarks = require('../utilities/landmarks.js'),
    canvas = require('../rendering/canvas.js');



// Default style overrides (see renderhelper.js function setNewContext,
// which takes an object of named context styles as a param)

var _timeRunningOutStyles = {
        fillStyle: 'red'
    },

    _timeLimit = 7000,

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

    // Used by engine.js to determine is if needs to change game state to endScreen
    _timeIsUp = false,

    // Will be initialized to value of a window.setInterval
    _timerInterval;

// We want _timeLimit be the only place where the game time limit is set
function _setUpTimeLeft() {
    _timeLeft.amount = _timeLimit;
}

function _startTimer() {
    _timerInterval = window.setInterval(function(){
            _timeLeft.time -= 1000;
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

function checkForTimeUp() {
    if (_timeLeft.amount === 0) {
        _timeIsUp = true;
    }
}

function checkForTimeRunningOut() {
    if (_timeLeft.amount <= 5000) {
        _timeRunningOut = true;
    }
}

function timeIsUp() {
    return _timeIsUp;
}

function timeRunningOut() {
    return _timeRunningOut;
}

function update() {
    if (_timeIsUp) {
        _stopTimer();
    }
}

function render() {
    var timeLeftInSeconds = _timeLeft.time / 1000;

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
    timeIsUp: timeIsUp,
    timeRunningOut: timeRunningOut
};