var score = require('../game_objects/score');
var timer = require('../game_objects/timer');









// Resets per game

function resetGameInformation() {
    score.reset();
    timer.reset();


}




module.exports = {

    resetGameInformation: resetGameInformation,

};