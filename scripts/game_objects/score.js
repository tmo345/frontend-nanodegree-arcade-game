var renderHelper = require('../utilities/render_helper.js');
var landmarks = require('../utilities/landmarks.js');
var canvas = require('../graphics_objects/canvas.js');



var _currentScore = 0,
    _scoreUpAmount = 4000,
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


function reset () {
    _currentScore = 0;
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

function subscribeToCollisionStatus(statePubSub) {
    statePubSub.subscribe('collisionOccured', scoreDown);

}

function subscribeToPlayerInWaterStatus(statePubSub) {
    statePubSub.subscribe('playerReachedWater', scoreUp);
}


function getCurrentScore() {
    return _currentScore;
}

function scoreUp(statePubSub) {
     _changeScore('up', statePubSub);
}

function scoreDown(statePubSub) {
    _changeScore('down', statePubSub);
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
    render: render,
    reset: reset,
    subscribeToPlayerInWaterStatus: subscribeToPlayerInWaterStatus,
    subscribeToCollisionStatus: subscribeToCollisionStatus,
    getCurrentScore: getCurrentScore
};