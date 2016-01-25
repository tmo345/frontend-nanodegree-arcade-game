var renderHelper = require('../utilities/renderhelpers.js'),
    resources = require('../utilities/resources.js'),
    grid = require('./grid.js'),
    canvas = require('./canvas.js');

var instructions = {


    endScreenText: {
        scoreTextStart: 'You scored ',
        scoreTextEnd: ' points!',
        directions: 'To play againL press Enter',
    },

    scoreTextStyle: {
        font: '36px "Bangers"',
        textAlign: 'center'
    },

    endDirectionStyle: {
        font: '24px "Bangers"'
    },

    endScreenGraphics: {
        rectangleWidth: 400,
        rectangleHeight: 300,
        fillStyle: {
            fillStyle: 'rgba(255, 255, 255, 0.75)'
        }
    },





    renderEndScreenText: function(ctx) {

    },

    renderEndScreenGraphics: function(ctx) {

    }
};

module.exports = instructions;