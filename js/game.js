var constants = {
    FULLSCREEN: -1
};

var gameConfig = {
    config: {
        type: Phaser.AUTO,
        width: constants.FULLSCREEN,
        height: constants.FULLSCREEN,
        timerDelay: 50,
        timer: timer,
        scene: {
            preload: preload,
            create: create,
            update: update,
            render: render
        }
    },
    game: undefined
};

var currentLevel;

window.onload = function() {
    var gameContainer = document.getElementById("game-content");
    var width = gameConfig.config.width;
    var height = gameConfig.config.height;

    if (width == constants.FULLSCREEN) {
        gameConfig.config.width = width = window.innerWidth;
    }

    if (height == constants.FULLSCREEN) {
        gameConfig.config.height = height = window.innerHeight;
    }

    currentLevel = new Level01(gameConfig);
    gameConfig.game = new Phaser.Game(width, height, gameConfig.config.type, gameContainer, gameConfig.config.scene);
};

function preload() {
    var game = gameConfig.game;

    game.load.image('bullet', '/assets/sprites/bullet.png');
    game.load.image('ship', '/assets/sprites/shmup-ship2.png');
    game.load.image('stone01', '/assets/particlestorm/particles/barkshard.png');
    game.load.image('map01', 'assets/pics/ra_einstein.png');

    game.load.image('background', '/assets/skies/deep-space.jpg');
    game.load.image('foreground', '/assets/wip/karamoon.png');
    game.load.bitmapFont('shmupfont', '/assets/fonts/shmupfont.png', '/assets/shmupfont.xml');

    for (var i = 1; i <= 11; i++) {
        game.load.image('bullet' + i, '/assets/bullets/bullet' + (i < 10 ? "0" : "") + i + '.png');
    }
}

function create() {
    gameConfig.game.physics.startSystem(Phaser.Physics.ARCADE);
    gameConfig.game.renderer.renderSession.roundPixels = true;
    gameConfig.game.time.events.loop(gameConfig.config.timerDelay, gameConfig.config.timer, this);
    currentLevel.create();
}

function update() {
    currentLevel.update();
}

function timer() {
    currentLevel.timer();
}

function render() {
    currentLevel.render();
}
