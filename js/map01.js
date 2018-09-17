var Map01 = {
    init: function () {
        game.renderer.renderSession.roundPixels = true;

        this.map = {
            verticalPadding: 500,
            horizontalPadding: 500
        };
    },

    create: function() {
        this.totalHeight = game.height + this.map.verticalPadding * 2;
        this.totalWidth = game.width + this.map.horizontalPadding * 2;

        game.world.setBounds(0, 0, this.totalWidth, this.totalHeight);

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

        var newHeight = game.height + 200;
        this.aTenth = newHeight * 0.1;

        game.stage.backgroundColor = "#000000";
        this.background = game.add.image(this.totalWidth / 2, this.totalHeight / 2, 'map01.membrane');
        this.background.anchor.set(0.5, 0.5);

        var scale = newHeight / this.background.height;
        this.background.height = newHeight;
        this.background.width = this.background.width * scale;

        this.ship = game.add.sprite(0, 0, "level01.ship", 2);
        this.ship.anchor.set(0.5, 0.5);
        this.ship.animating = false;

        // scale ship
        var shipScale = config.shipWidth / this.ship.width;
        this.ship.scale.setTo(shipScale);

        // configure camera to follow ship smoothly
        game.camera.follow(this.ship, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
        
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
                right: 2,
                left: 0,
                up: 2,
                down: -1
            },
            {
                x: this.background.x - (this.background.width / 2) + (this.aTenth * 3),
                y: game.world.centerY - (this.aTenth * 3),
                right: -1,
                left: 1,
                up: -1,
                down: 1
            }
        ]
    },
    
    shipStopped: function(ship) {
        ship.animating = false;
    },

    update: function() {
        if (this.ship.animating) {
            return;
        }

        if (this.selectLevel.isDown) {
            startLevel("level0" + (this.currentMapPostion + 1));
        } else {
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
