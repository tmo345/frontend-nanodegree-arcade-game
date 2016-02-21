'use strict';

/** High Scores object - Uses localStorage to persist high scores between game
 *   sessions for user in same browser. It does this by tracking the currentGameScore
 *   through a subscription to scoreChange. When it receives a timeIsUp state change
 *   through a subscription to timeIsUp, it pulls the high scores from local storage,
 *   compares current score them, updates high scores if necessary, pushes the updated
 *   high scores back to local storage, and then renders them to the DOM.
 *
 *  NOTE: Timer module has a mechanism to ensure that it only publishes the timeIsUp
 *  state change once. Otherwise, setHighScoreForGame and render methods would be called
 *  continuously after time ran out.
 *
 *  Exports:
 *      highScores object
 *
 *  Properties: currentScore
 *  Methods: updateCurrentScore, subcribeToScoreChangeStatus, pullFromStorage,
 *      pushToStorage, updateHighScore, getSortedStorageHighScores, setHighScoreForGame,
 *      render, subscribeToTimeIsUpStatus
 *
 *  Subscriptions + subscriber functions:
 *      scoreChange: updateCurrentScore
 *      timeIsUp: setHighScoreForGame, render
 */

var dataStorage = require('../utilities/datastorage.js');

/** Use local storage API to store high scores
 */

// Set high scores to default of 0 if not already set
if (! dataStorage.highScores) {
    dataStorage.highScores = [0, 0, 0, 0, 0];
}

// Helper functions

function stringToIntArray(data) {
    var tempHighScore = data.split(',');

    tempHighScore.map(function(score, index) {
        tempHighScore[index] = parseInt(score, 10);
    });

    return tempHighScore;
}

function compareNumbers(a, b) {
    return b - a;
}


var highScores = {
    // mirrors the currentScore in the score object through a subscription to score changes
    currentScore: 0,

    updateCurrentScore: function(gameCurrentScore) {
        this.currentScore = gameCurrentScore;
    },

    subscribeToScoreChangeStatus: function(statePubSub) {
        var updateCurrentScoreBound = this.updateCurrentScore.bind(this);

        statePubSub.subscribe('scoreChange', updateCurrentScoreBound);
    },

    pullFromStorage: function() {
        this.highScores = stringToIntArray(dataStorage.highScores);
    },

    pushToStorage: function() {
        dataStorage.highScores = this.highScores;
    },

    updateHighScore: function(currentScore) {
        var currentHighScores = this.highScores,
            minHighScore,
            minScoreIndex;

        // using Math.min.apply allows you to pass array of parameters to Math.min
        // Source: MDN Function.prototype.apply
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
        minHighScore = Math.min.apply(null, currentHighScores),
        minScoreIndex = currentHighScores.indexOf(minHighScore);

        if (currentScore > minHighScore) {
            currentHighScores[minScoreIndex] = currentScore;
        }

        this.highScores = currentHighScores;
    },

    getSortedStorageHighScores: function() {
        // localStorage returns a string which needs to be converted to array
        var savedHighScores = stringToIntArray(dataStorage.highScores);
        savedHighScores.sort(compareNumbers); // sort descending by amount
        return savedHighScores;
    },

    // Steps to pull high scores from local storage, update them in temp var, then
    // push back new high scores to local storage
    setHighScoreForGame: function() {
            this.pullFromStorage();
            this.updateHighScore(this.currentScore);
            this.pushToStorage();
    },

    render: function() {
        var currentHighScores = this.getSortedStorageHighScores(),
            scoreListItem;

        for (var i = 0; i < currentHighScores.length; i++) {
            scoreListItem = document.querySelector('.score-' + i);
            scoreListItem.innerText = currentHighScores[i];
        }
    },

    subscribeToTimeIsUpStatus: function(statePubSub) {
        var setHighScoreForGameBound = this.setHighScoreForGame.bind(this),
            renderBound = this.render.bind(this);

        statePubSub.subscribe('timeIsUp', setHighScoreForGameBound);
        statePubSub.subscribe('timeIsUp', renderBound);
    },

};


module.exports = highScores;