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
        game.load.image('map_01', '/img/map_01.png');
    },

    create: function() {
        this.selectLevel = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        game.stage.backgroundColor = "#000000";
        game.add.image(game.world.centerX, game.world.centerY, 'map_01').anchor.set(0.5);
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
