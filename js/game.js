var constants = {
    FULLSCREEN: -1,
    BOOT: "boot",
    LOAD: "load",
    MAP_01: "map01",
    LEVEL_01: "level01"
};

var gameConfig = {
    type: Phaser.AUTO,
    width: constants.FULLSCREEN,
    height: constants.FULLSCREEN,
    timerDelay: 50
};

var first = true;
var game;
var text;
var currentLevel;
var levels = {};

var Boot = {
    preload : function () {
        console.log("boot preload");
        game.load.image('loadingbar', '/res/ui/loader.png');
    },

    // create method
    create : function () {
        console.log("boot create");
        game.state.start(constants.LOAD);
    }
};

var Load = {
    preload : function () {
        console.log("load preload");
        // add a sprite that uses my loadingbar asset,
        // that was quickly loaded during the Boot Sate
        var loadSprite = game.add.sprite(0, 0, 'loadingbar');
        loadSprite.width = 0;
        loadSprite.x = game.world.centerX - loadSprite.width / 2;
        loadSprite.y = game.world.centerY - 16;
 
        // what to do when a file as completed downloading
        game.load.onFileComplete.add(function (progress, key, success, loaded, total) {
 
            loadSprite.width = game.width * (progress / 100);
            loadSprite.x = game.world.centerX - loadSprite.width / 2;
 
            console.log('progress: ' + progress);
            console.log('key: ' + key);
            console.log('success: ' + success);
            console.log('loaded: ' + loaded + '\/' + total);
            console.log('**********');
 
        }, this);
 
        // start loading the asset files
        for (var levelName in levels) { 
           if (levels.hasOwnProperty(levelName)) {
               levels[levelName].loadSprites(game);
           }
        }
 
    },

    // when done create will be called
    create : function () {
        console.log('ready to rock!');
        startLevel(constants.MAP_01);
    }
 
};

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

    map01 = new Map01(gameConfig);
    levels[constants.MAP_01] = map01;

    level01 = new Level01(gameConfig);
    levels[constants.LEVEL_01] = level01;

    currentLevel = constants.MAP_01;

    game.state.add(constants.MAP_01, map01);
    game.state.add(constants.LEVEL_01, level01);
    
    game.state.add(constants.BOOT, Boot);
    game.state.add(constants.LOAD, Load);

    startLevel(constants.BOOT);
};

function startLevel(levelName) {
    console.log("Starting level " + currentLevel);
    currentLevel = levelName;
    game.state.start(levelName);
}

function createCallback() {
    if (first) {
        first = false;
        game.load.onLoadStart.add(loadStart, this);
        game.load.onFileComplete.add(fileComplete, this);
        game.load.onLoadComplete.add(loadComplete, this);
    }

    text = game.add.text(32, 32, 'Click to start load', { fill: '#ffffff' });
    levels[currentLevel].loadSprites();
    game.load.start();
}

function loadStart() {
	text.setText("Loading ...");
	console.log("Loading ...");
}

//	This callback is sent the following parameters:
function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    var str = "File Complete: " + progress + "% - " + totalLoaded + " out of " + totalFiles;
	text.setText(str);
	console.log(str);
}

function loadComplete() {
	text.setText("Load Complete");
	console.log("Load Complete");
}
