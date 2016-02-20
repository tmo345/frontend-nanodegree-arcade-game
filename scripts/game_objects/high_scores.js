var dataStorage = require('../utilities/datastorage.js');

/** Use local storage API to store high scores
 */

// Set high scores to default of 0 if not already set
if (! dataStorage.highScores) {
    dataStorage.highScores = [0, 0, 0, 0, 0];
}


var highScores = {
    // mirrors the currentScore in the score object through a subscription to score changes
    currentScore: 0,
    calledForThisGame: false,

    hasBeenCalledForGame: function() {
        if (this.calledForThisGame === true) {
            return true;
        } else {
            return false;
        }
    },

    updateCurrentScore: function(gameCurrentScore) {
        this.currentScore = gameCurrentScore;
    },

    subscribeToScoreChangeStatus: function(statePubSub) {
        var updateCurrentScoreBound = this.updateCurrentScore.bind(this);

        statePubSub.subscribe('scoreChange', updateCurrentScoreBound);
    },

    setAsCalledForGame: function() {
        this.calledForThisGame = true;
    },

    resetCalledStatus: function() {
        this.calledForThisGame = false;
    },

    pullFromStorage: function() {
        this.highScores = stringToIntArray(dataStorage.highScores);
        console.log('pullFromStorage');
    },

    pushToStorage: function() {
        dataStorage.highScores = this.highScores;
    },

    getSortedStorageHighScores: function() {
        // localStorage returns a string which needs to be converted to array
        var savedHighScores = stringToIntArray(dataStorage.highScores);
        savedHighScores.sort(compareNumbers); // sort descending by amount
        return savedHighScores;
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


    // Steps to pull high scores from local storage, update them in temp var, then
    // push back new high scores to local storage
    setHighScoreForGame: function(statePubSub) {
            this.pullFromStorage();
            this.updateHighScore(this.currentScore);
            this.pushToStorage();
            this.setAsCalledForGame();
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

        this.setHighScoreSub = statePubSub.subscribe('timeIsUp', setHighScoreForGameBound);
        this.setRenderSub = statePubSub.subscribe('timeIsUp', renderBound);
    },

    // unSubscribeFromTimeUpStatus: function() {
    //     this.setHighScoreSub.unsubscribe();
    //     this.setRenderSub.unsubscribe();
    // }
};


// Helper to convert the string retrieved from localstorage to an array of numbers

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

module.exports = highScores;