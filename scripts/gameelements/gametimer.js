var renderHelper = require('../rendering/renderhelper.js'),
    landmarks = require('../utilities/landmarks.js');

var gameTimer = {

    // Default style overrides (see renderhelper.js function setNewContext,
    // which takes an object of named context styles as a param)
    timeRunningOutStyles: {
        fillStyle: 'red'
    },

    timeLimit: 7000,

    heading: {
        text: 'Timer: ',
        x: landmarks.xLeftSideOf.tile4 + 20,
        y: landmarks.yTopOf.water + 50
    },

    timeLeft: {
        // time property is set in method: setUpTimeLeft
        x: landmarks.xLeftSideOf.tile5 + 20,
        y: landmarks.yTopOf.water + 50
    },

    // Determine if the rendered time is red to indicate time is running out.
    timeRunningOut: false,

    // Used by engine.js to determine is if needs to change game state to endScreen
    timeIsUp: false,

    // We want this.timeLimit be the only place where the game time limit is set
    setUpTimeLeft: function() {
        this.timeLeft.time = this.timeLimit;
    },

    startTimer: function() {
        var that = this;
        this.timerInterval = window.setInterval(function(){
                that.timeLeft.time -= 1000;
        }, 1000);
    },

    stopTimer: function() {
        var that = this;
        window.clearInterval(that.timerInterval);
    },

    reset: function() {
        this.setUpTimeLeft();
        this.timeIsUp = false;
        this.timeRunningOut = false;
        this.startTimer();
    },

    isTimeUp: function() {
        if (this.timeLeft.time === 0) {
            this.timeIsUp = true;
            return true;
        }
    },

    update: function() {
        if (this.timeLeft.time <= 5000) {
            this.timeRunningOut = true;
        }
        if (this.timeIsUp) {
            this.stopTimer();
        }
    },

    render: function(ctx) {
        var timeLeftInSeconds = this.timeLeft.time / 1000;

        ctx.strokeText(this.heading.text, this.heading.x, this.heading.y);
        ctx.fillText(this.heading.text, this.heading.x, this.heading.y);

        // when time is almost out, make the time left red
        if (this.timeRunningOut) {
            renderHelper.setNewContext(ctx, this.timeRunningOutStyles);
        }

        ctx.strokeText(timeLeftInSeconds, this.timeLeft.x, this.timeLeft.y);
        ctx.fillText(timeLeftInSeconds, this.timeLeft.x, this.timeLeft.y);

    }


};


module.exports = gameTimer;