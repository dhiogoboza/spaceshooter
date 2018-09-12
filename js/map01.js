var Map01 = function(gameConfig) {
    this.gameConfig = gameConfig;
    this.background = null;

    this.ship = null;
    this.cursors = null;
    this.wasd = null;
    
    this.selectLevel = null;
} 

Map01.prototype = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;
    },

    loadSprites: function(game) {
        var sprites = [
            ['map01.membrane', '/res/organelles/membrane.png'],
            ['map01.mitocondria', '/res/organelles/mitocondria.png'],
            ['map01.lisossomo', '/res/organelles/lisossomo.png'],
            ['map01.golgi', '/res/organelles/golgi.png']
        ];

        for (var i = 0; i < sprites.length; i++) {
            game.load.image(sprites[i][0], sprites[i][1]);
        }
    },

    create: function() {
        this.selectLevel = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        game.stage.backgroundColor = "#000000";

        var background = game.add.image(game.world.centerX, game.world.centerY, 'map01.membrane');
        background.anchor.set(0.5, 0.5);
        var newWidth = game.height - 200;
        var scale = newWidth / background.height;
        background.height = newWidth;
        background.width = background.width * scale;
        
        var ship = game.add.sprite(50, game.world.centerY, "level01.ship", 2);
        ship.anchor.set(0.5, 0.5);
        ship.scale.setTo(scale);
        game.add.tween(ship).to( { angle: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, false);
    },

    update: function() {
        if (this.selectLevel.isDown) {
            startLevel(constants.LEVEL_01);
        }
    },

    timer: function() {
        
    },

    render: function() {
        
    }
}
