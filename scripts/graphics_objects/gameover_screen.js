'use strict';

/** Object containing styles and text for game over screen overlay
 *
 *  Properties: scoreTextStyle, directionsStyle, rectFillStyle, scoreText, directions,
 *      rectangle
 *  Methods: renderRectangle, renderScoreText, renderDirections
 *
 */

var renderHelper = require('../utilities/render_helper.js'),
    canvas = require('../graphics_objects/canvas.js');


var gameOver = {

    // Default style overrides (see renderhelper.js function setNewContext,
    // which takes an object of named context styles as a param)
    scoreTextStyle: {
        font: '36px "Bangers"',
        textAlign: 'center',
        fillStyle: '#000'
    },

    directionsStyle: {
        font: '24px "Bangers"',
        fillStyle: '#000'
    },

    rectFillStyle: {
        fillStyle: 'rgba(255, 255, 255, 0.75)'
    },

    scoreText: {
        start: 'You scored ',
        end: ' points!',
        x: canvas.width/2,
        y: canvas.height/2
    },

    directions: {
        text: 'To play again press Enter',
        x: canvas.width/2,
        y: canvas.height/2 + 100
    },

    rectangle: {
        width: 400,
        height: 300,
        x: 50,
        y: 200
    },

    renderRectangle: function(ctx) {
        renderHelper.setNewContext(ctx, this.rectFillStyle);
        ctx.fillRect(this.rectangle.x, this.rectangle.y, this.rectangle.width, this.rectangle.height);
    },

    // Expect a score object with property currentScore
    renderScoreText: function(ctx, score) {
        var scoreTextFull = this.scoreText.start + score.getCurrentScore() + this.scoreText.end;

        renderHelper.setNewContext(ctx, this.scoreTextStyle);
        ctx.fillText(scoreTextFull, this.scoreText.x, this.scoreText.y);
    },

    renderDirections: function(ctx) {
        renderHelper.setNewContext(ctx, this.directionsStyle);
        ctx.fillText(this.directions.text, this.directions.x, this.directions.y);
    }

};

module.exports = gameOver;