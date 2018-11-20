var WINDOW_WIDTH =  window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
var WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

var constants = {
    FULLSCREEN: -1,
    BOOT: "boot",
    LOAD: "load",
    MENU: "menu",
    MAP_01: "map01",
    LEVEL_01: "level01",
    LEVEL_BOSS: "levelBoss"
};

var config = {
    type: Phaser.CANVAS,
    width: constants.FULLSCREEN,
    height: constants.FULLSCREEN,
    timerDelay: 50,
    shipWidth: 50,
    lives: 3
};

var mapPoints = [[
    {
        x: 0,
        y: 0,
        color: 0xFFFFFF,
        radius: config.shipWidth * 0.75,
        right: 1,
        left: -1,
        up: -1,
        down: -1,
        locked: false
    },
    {
        x: 0,
        y: 0,
        color: 0xFFFFFF,
        radius: config.shipWidth * 0.75,
        right: 2,
        left: 0,
        up: 2,
        down: -1,
        locked: true
    },
    {
        x: 0,
        y: 0,
        color: 0xFFFFFF,
        radius: config.shipWidth * 0.75,
        right: -1,
        left: 1,
        up: -1,
        down: 1,
        locked: true
    }
]];

var first = true;
var game;
var text;
var currentLevel;
var levels = [constants.LEVEL_01, constants.LEVEL_BOSS];

var Boot = {
    preload : function () {
        console.log("boot preload");
        game.load.image('loadingbar', '/assets/ui/loader.png');
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
        }, this);
 
        // start loading the asset files
        var sprites = [
            ['ship01', '/assets/players/playerShip1_blue.png'],
            ['stone01', '/assets/particlestorm/barkshard.png'],
            ['level01.background', '/assets/bgs/purple.png'],
            ['foreground', '/assets/wip/karamoon.png'],
            ['enemy01', '/assets/enemies/ufoRed.png'],
            ['virusGreen', '/assets/enemies/virusGreen.png'],

            ['weapon02', '/assets/powerups/weapon02.png'],

            ['levelBoss.background', '/assets/bgs/blue.png'],

            ['map01.boss', '/assets/enemies/boss01.png'],

            ['ui.station01', '/assets/ui/station01.png'],
            ['ui.lock', '/assets/ui/lock.png'],

            ['menu.background', '/assets/bgs/menu.jpg'],
            ['menu.redButton', '/assets/ui/buttonRed.png'],
            ['menu.yellowButton', '/assets/ui/buttonYellow.png'],
            ['menu.selector', '/assets/ui/selector.png'],

            ['hud.life', '/assets/ui/playerLife1_blue.png']
        ];
        
        for (var i = 1; i <= 11; i++) {
            sprites.push(['bullet' + i, '/assets/bullets/bullet' + (i < 10 ? "0" : "") + i + '.png']);
        }
        
        var spritesheets = [
            ['explosion', 'assets/particlestorm/explosion.png', 128, 128],
            ['ship01.turbine', '/assets/players/fire01.png', 31, 14],
            ['button', '/assets/ui/buttons.png', 222, 39]
        ];
        
        for (var i = 0; i < sprites.length; i++) {
            game.load.image(sprites[i][0], sprites[i][1]);
        }
        
        for (var i = 0; i < spritesheets.length; i++) {
            var sheet = spritesheets[i];
            game.load.spritesheet(sheet[0], sheet[1], sheet[2], sheet[3]);
        }
    },

    // when done create will be called
    create : function () {
        console.log('load create');
        startLevel(constants.MENU);
    }
 
};

window.onload = function() {
    var output = new FontFaceObserver('KenvectorFuture');
    output.load().then(function () {
        initGame();
    });
};

window.onresize = function() {
    config.width = window.innerWidth;
    config.height = window.innerHeight;
    
    game.width = config.width;
    game.height = config.height;

    if (game.state.getCurrentState().onResize !== undefined) {
        game.state.getCurrentState().onResize();
    }
};

function initGame() {
    var gameContainer = document.getElementById("game-content");
    var width = config.width;
    var height = config.height;

    if (width == constants.FULLSCREEN) {
        config.width = width = window.innerWidth;
    }

    if (height == constants.FULLSCREEN) {
        config.height = height = window.innerHeight;
    }
    
    game = new Phaser.Game(width, height, config.type, gameContainer);

    currentLevel = constants.MAP_01;

    game.state.add(constants.BOOT, Boot);
    game.state.add(constants.LOAD, Load);

    game.state.add(constants.MENU, Menu);
    game.state.add(constants.MAP_01, Map01);
    game.state.add(constants.LEVEL_01, Level01);
    game.state.add(constants.LEVEL_BOSS, LevelBoss);

    startLevel(constants.BOOT);
}

function startLevel(levelName) {
    console.log("Starting level " + currentLevel);
    currentLevel = levelName;
    game.state.start(levelName);
}

function completeLevel(mapIndex, levelIndex) {
    mapPoints[mapIndex][levelIndex + 1].locked = false;
}
