var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 505;
canvas.height = 606;

document.body.appendChild(canvas);

module.exports = {
    height: canvas.height,
    width: canvas.width,
    ctx: ctx
};