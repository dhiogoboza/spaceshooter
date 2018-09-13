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
        // init keys
        this.selectLevel = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
        this.cursors = game.input.keyboard.createCursorKeys();
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            fire: game.input.keyboard.addKey(Phaser.Keyboard.K),
        };

        var newHeight = game.height - 50;
        this.aTenth = newHeight * 0.1;

        game.stage.backgroundColor = "#000000";
        this.background = game.add.image(game.world.centerX, game.world.centerY, 'map01.membrane');
        this.background.anchor.set(0.5, 0.5);

        var scale = newHeight / this.background.height;
        this.background.height = newHeight;
        this.background.width = this.background.width * scale;
        
        this.background.x = this.background.x + (game.width - this.background.width) / 2;

        this.ship = game.add.sprite(0, 0, "level01.ship", 2);
        this.ship.anchor.set(0.5, 0.5);
        this.ship.scale.setTo(scale);
        this.ship.animating = false;
        
        game.add.tween(this.ship).to( { angle: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, false);

        // init map
        this.initMap();
        this.currentMapPostion = 0;
        var position = this.mapPoints[this.currentMapPostion];
        this.ship.x = position.x;
        this.ship.y = position.y;
    },

    updateShipPosition: function() {
        this.ship.animating = true;
        var position = this.mapPoints[this.currentMapPostion];
        var tween = game.add.tween(this.ship);
        tween.onComplete.add(this.shipStopped);
        tween.to({x: position.x, y: position.y}, 500, Phaser.Easing.Linear.None, true, 0, 0, false);
    },
    
    initMap: function() {
        this.mapPoints = [
            {
                x: this.background.x - (this.background.width / 2) - (this.aTenth * 2),
                y: game.world.centerY,
                right: 1,
                left: -1,
                up: -1,
                down: -1
            },
            {
                x: this.background.x - (this.background.width / 2) + (this.aTenth * 1),
                y: game.world.centerY,
                right: -1,
                left: 0,
                up: 2,
                down: -1
            },
            {
                x: this.background.x - (this.background.width / 2) + (this.aTenth * 2),
                y: game.world.centerY - (this.aTenth * 3),
                right: -1,
                left: 1,
                up: -1,
                down: 1
            }
        ]
    },
    
    shipStopped: function(ship) {
        console.log("terminou")
        ship.animating = false;
    },

    update: function() {
        if (this.selectLevel.isDown) {
            startLevel(constants.LEVEL_01);
        } else {
            if (this.ship.animating) {
                return;
            }
            var target;
            if (this.cursors.left.isDown || this.wasd.left.isDown) {
                target = "left";
            } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
                target = "right";
            } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
                target = "up";
            } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
                target = "down";
            } else {
                return;
            }

            var position = this.mapPoints[this.currentMapPostion];
            if (position[target] >= 0) {
                this.currentMapPostion = position[target];
                this.updateShipPosition();
            }
        }
    },

    timer: function() {
        
    },

    render: function() {
        
    }
}
