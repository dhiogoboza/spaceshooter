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

    preload: function() {
        this.load.image('map_01', '/img/map_01.png');
    },

    create: function() {
        game.stage.backgroundColor = "#000000";
        // game.stage.backgroundColor = 0x4488aa;
        // game.stage.backgroundColor = 'rgb(68, 136, 170)';
        // game.stage.backgroundColor = 'rgba(68, 136, 170, 0.5)';
        game.add.image(game.world.centerX, game.world.centerY, 'map_01').anchor.set(0.5);

        this.selectLevel = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
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
