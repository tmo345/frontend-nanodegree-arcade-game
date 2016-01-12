var dataStorage = require('../utilities/datastorage.js');

if (! dataStorage.highScores) {
    dataStorage.highScores = [0, 0, 0, 0, 0];
}

var HighScores = function() {
    this.calledForThisGame = false;
};


HighScores.prototype.calledOnceForThisGame = function() {
    this.calledForThisGame = true;
};


HighScores.prototype.resetCalledStatus = function() {
    this.calledForThisGame = false;
};


HighScores.prototype.pullFromStorage = function() {
    this.highScores = stringToIntArray(dataStorage.highScores);
};


HighScores.prototype.pushToStorage = function() {
    dataStorage.highScores = this.highScores;
};

HighScores.prototype.getSortedStorageHighScores = function() {
   var savedHighScores = stringToIntArray(dataStorage.highScores);
   savedHighScores.sort(compareNumbers);
   savedHighScores.reverse();
   return savedHighScores;
};

HighScores.prototype.updateHighScore = function(score) {
    var currentHighScores = this.highScores,
        minHighScore,
        minScoreIndex;

    // using Math.min.apply allows you to pass array of parameters to Math.min
    // Source: MDN Function.prototype.apply
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    minHighScore = Math.min.apply(null, currentHighScores),
    minScoreIndex = currentHighScores.indexOf(minHighScore);

    if (score > minHighScore) {
        currentHighScores[minScoreIndex] = score;
    }

    this.highScores = currentHighScores;
};


// Helper to convert the string retrieved from localstorage to an array of numbers

function stringToIntArray(data) {
    var tempHighScore = data.split(','),
        scoreIndex;

    tempHighScore.forEach(function(score) {
        scoreIndex = tempHighScore.indexOf(score);
        tempHighScore[scoreIndex] = parseInt(score, 10);
    });

    return tempHighScore;
}

function compareNumbers(a, b) {
    return a - b;
}

module.exports = HighScores;