'use strict';

/** Canvas - creates canvas element, sets up 2d context, and appends to body
 *
 *  Exports:
 *      height: canvas height
 *      width: canvas width
 *      context: canvas 2d context
 */

var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    canvasHolder = document.querySelector('.canvas-holder');

canvas.width = 505;
canvas.height = 606;

canvasHolder.appendChild(canvas);

module.exports = {
    height: canvas.height,
    width: canvas.width,
    ctx: ctx
};
