var renderHelper = require('../utilities/renderhelper.js'),
    resources = require('../utilities/resources.js'),
    landmarks = require('../utilities/landmarks.js');

var startScreen = {

    // Default style overrides (see renderhelper.js function setNewContext,
    // which takes an object of named styles as a param)

    headingStyle: {
        font: '30px "Bangers"'
    },

    subHeadingStyle: {
        font: '24px "Bangers"'
    },

    startDirectionStyle: {
        font: '30px "Bangers'
    },

    // Start Screen Elements with coordinates

    mainHeading: {
        text: 'Crossing the Road',
        x: landmarks.xLeftSideOf.tile1 + 5,
        y: landmarks.yTopOf.canvasTop + 40,
    },

    subHeading: {
        text: 'Into the Water for Some Reason',
        x: landmarks.xLeftSideOf.tile2 + 50,
        y: landmarks.yTopOf.water + 60,
        rotation: -2 * Math.PI / 180
    },

    directions: [
        {
            text: 'Press',
            x: landmarks.xLeftSideOf.tile2 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'Enter',
            x: landmarks.xLeftSideOf.tile3 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'To',
            x: landmarks.xLeftSideOf.tile4 + 10,
            y: landmarks.yTopOf.grass1 + 50
        },
        {
            text: 'Start',
            x: landmarks.xLeftSideOf.tile2 + 10,
            y: landmarks.yTopOf.grass2 + 50
        },
        {
            text: 'Game',
            x: landmarks.xLeftSideOf.tile3 + 10,
            y: landmarks.yTopOf.grass2 + 50
        }
    ],


    player: {
        sprite: 'images/char-boy.png',
        x: landmarks.xLeftSideOf.tile5,
        y: landmarks.yEntityAdjust.stone2
    },

    enemy: {
        sprite: 'images/enemy-bug.png',
        coordinates: [
            { x: landmarks.xLeftSideOf.tile2, y: landmarks.yEntityAdjust.stone1 },
            { x: landmarks.xLeftSideOf.tile3, y: landmarks.yEntityAdjust.stone2 },
            { x: landmarks.xLeftSideOf.tile2, y: landmarks.yEntityAdjust.stone3 }
        ]
    },

    // 5, 40
    renderHeading: function(ctx) {
        renderHelper.setNewContext(ctx, this.headingStyle);
        ctx.fillText(this.mainHeading.text, this.mainHeading.x, this.mainHeading.y);
    },
    //  -2 * Math.PI / 180 150 110
    renderSubHeading: function(ctx) {
        renderHelper.setNewContext(ctx, this.subHeadingStyle);
        ctx.rotate(this.subHeading.rotation);
        ctx.fillText(this.subHeading.text, this.subHeading.x, this.subHeading.y);
        ctx.resetTransform();
    },

    // Layout of directions on start screen:
    //
    // Press Enter To
    // Start Game

    renderDirections: function(ctx) {
        renderHelper.setNewContext(ctx, this.startDirectionStyle);
        for (var i = 0; i < this.directions.length; i++) {
            ctx.fillText(this.directions[i].text, this.directions[i].x, this.directions[i].y);
            }
    },

    renderPlayer: function(ctx) {
        ctx.drawImage(resources.get(this.player.sprite), this.player.x, this.player.y);
    },

    renderEnemies: function(ctx) {
        for (var i = 0; i < 3; i++) {
            ctx.drawImage(resources.get(this.enemy.sprite), this.enemy.coordinates[i].x, this.enemy.coordinates[i].y);
        }
    }
};

module.exports = startScreen;