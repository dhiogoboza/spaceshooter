var WINDOW_WIDTH =  window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
var WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

var constants = {
    FULLSCREEN: -1,
    BOOT: "boot",
    LOAD: "load",
    MENU: "menu",
    MAP_01: "map01",
    LEVEL_01: "level01"
};

var config = {
    type: Phaser.CANVAS,
    width: constants.FULLSCREEN,
    height: constants.FULLSCREEN,
    timerDelay: 50,
    shipWidth: 50,
    lives: 3
};

var first = true;
var game;
var text;
var currentLevel;

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
        }, this);
 
        // start loading the asset files
        var sprites = [
            ['bullet', '/assets/sprites/bullet.png'],
            ['level01.ship', '/res/players/playerShip1_blue.png'],
            ['stone01', '/assets/particlestorm/particles/barkshard.png'],
            ['map01', 'assets/pics/ra_einstein.png'],
            ['background', '/res/bgs/purple.png'],
            ['foreground', '/assets/wip/karamoon.png'],
            ['enemy01', '/res/enemies/ufoRed.png'],

            ['map01.membrane', '/res/organelles/membrane.png'],
            ['map01.mitocondria', '/res/organelles/mitocondria.png'],
            ['map01.lisossomo', '/res/organelles/lisossomo.png'],
            ['map01.golgi', '/res/organelles/golgi.png'],

            ['menu.background', '/res/bgs/menu.jpg'],
            ['menu.redButton', '/res/ui/buttonRed.png'],
            ['menu.yellowButton', '/res/ui/buttonYellow.png'],
            ['menu.selectorRight', '/res/ui/selector_right.png'],
            ['menu.selectorLeft', '/res/ui/selector_left.png'],

            ['hud.life', '/res/ui/playerLife1_blue.png']
        ];
        
        for (var i = 1; i <= 11; i++) {
            sprites.push(['bullet' + i, '/assets/bullets/bullet' + (i < 10 ? "0" : "") + i + '.png']);
        }
        
        var spritesheets = [
            ['explosion', 'assets/games/invaders/explode.png', 128, 128],
            ['button', '/res/ui/buttons.png', 222, 39]
        ];
        
        for (var i = 0; i < sprites.length; i++) {
            game.load.image(sprites[i][0], sprites[i][1]);
        }
        
        for (var i = 0; i < spritesheets.length; i++) {
            var sheet = spritesheets[i];
            game.load.spritesheet(sheet[0], sheet[1], sheet[2], sheet[3]);
        }
        
        this.game.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');
 
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

    startLevel(constants.BOOT);
}

function startLevel(levelName) {
    console.log("Starting level " + currentLevel);
    currentLevel = levelName;
    game.state.start(levelName);
}
