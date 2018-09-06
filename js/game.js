var constants = {
    FULLSCREEN: -1,
    MAP_01: "map01",
    LEVEL_01: "level01"
};

var gameConfig = {
    type: Phaser.AUTO,
    width: constants.FULLSCREEN,
    height: constants.FULLSCREEN,
    timerDelay: 50
};

var game;
var currentLevel;

window.onload = function() {
    var gameContainer = document.getElementById("game-content");
    var width = gameConfig.width;
    var height = gameConfig.height;

    if (width == constants.FULLSCREEN) {
        gameConfig.width = width = window.innerWidth;
    }

    if (height == constants.FULLSCREEN) {
        gameConfig.height = height = window.innerHeight;
    }
    
    game = new Phaser.Game(width, height, gameConfig.type, gameContainer);

    var map01 = new Map01(gameConfig);
    var level01 = new Level01(gameConfig);

    game.state.add(constants.MAP_01, map01);
    game.state.add(constants.LEVEL_01, level01);
    
    startLevel(constants.MAP_01);
};


function startLevel(levelName) {
    currentLevel = levelName;
    game.state.start(levelName);
}
