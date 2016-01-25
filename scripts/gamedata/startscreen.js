var renderHelper = require('../utilities/renderhelpers.js'),
    resources = require('../utilities/resources.js');

var startScreen = {

    mainHeading: 'Crossing the Road',
    subHeading: 'Into the Water for Some Reason',

    directions: [
        { press: 'Press' },
        { enter: 'Enter' },
        { to: 'To' },
        { start: 'Start' },
        { game: 'Game' }
    ],

    headingStyle: {
        font: '30px "Bangers"'
    },

    subHeadingStyle: {
        font: '24px "Bangers"'
    },

    startDirectionStyle: {
        font: '30px "Bangers'
    },

    graphics: {
        player: resources.get('images/char-boy.png'),
        enemy: resources.get('images/enemy-bug.png')
    },

    // 5, 40
    renderHeading: function(ctx, x, y) {
        renderHelper.setNewContext(ctx, this.headingStyle);
        ctx.fillText(this.mainHeading, x, y);
    },
    //  -2 * Math.PI / 180 150 110
    renderSubHeading: function(ctx, x, y, rotation) {
        renderHelper.setNewContext(ctx, this.subHeadingStyle);
        ctx.rotate(rotation);
        ctx.fillText(this.subHeading, x, y);
        ctx.resetTransform();
    },


    // coordinate array needs to be an array of [x, y] arrays
    renderDirections: function(ctx, x, y) {
        renderHelper.setNewContext(ctx, this.startDirectionStyle);

        ctx.fillText(this.directions.press, x, y);
        ctx.fillText(this.directions.enter, x * 2, y);
        ctx.fillText(this.directions.to, x * 3, y);
        ctx.fillText(this.directions.start, x, y * 2);
        ctx.fillText(this.directions.game, x * 2, y * 2);
    },





    renderGraphics: function(ctx) {

    },
};

module.exports = startScreen;