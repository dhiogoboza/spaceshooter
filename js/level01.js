function Level01(gameConfig) {
    this.gameConfig = gameConfig;
} 

Level01.prototype.create = function() {
    this.configureShip();
    this.configureLevel();
    
    var game = this.gameConfig.game;
    var ship = this.ship;

    // Create ship
    ship.sprite = game.add.sprite(320, 500, ship.spriteName, 2);

    this.stone = game.add.sprite(380, 500, "stone01", 3);
    var stone = this.stone;
    
    game.physics.arcade.enable([ship.sprite, stone], Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;

    var scale = ship.width / ship.sprite.width;
    ship.height = scale * ship.sprite.height;
    ship.sprite.scale.setTo(scale);

    //game.physics.arcade.enable(ship.sprite);
    //game.physics.arcade.gravity.y = 200;

    ship.sprite.body.collideWorldBounds = true;
    ship.sprite.body.maxVelocity.set(ship.maxSpeed);
    ship.sprite.body.mass = ship.mass;
    ship.sprite.body.enable = true;

    
    //game.physics.arcade.enable(stone);
    stone.body.collideWorldBounds = true;
    stone.body.maxVelocity.set(ship.maxSpeed);
    stone.body.mass = ship.mass * 100;
    stone.body.enable = true;
    
    
    //ship.sprite.body.bounce.y = 0.95;
	ship.sprite.body.collideWorldBounds = true;
    
    stone.body.allowGravity = false;
	stone.body.immovable = true;

    //game.physics.arcade.enable([ship.sprite, stone]);


    var weapon = ship.weapon;

    // Creates 30 bullets, using the 'bullet' graphic
    weapon.sprite = game.add.weapon(weapon.maxBullets, weapon.spriteName);

    weapon.sprite.fireAngle = weapon.fireAngle;

    // The bullet will be automatically killed when it leaves the world bounds
    weapon.sprite.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    // Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.sprite.bulletAngleOffset = weapon.bulletAngleOffset;

    // The speed at which the bullet is fired
    weapon.sprite.bulletSpeed = weapon.bulletSpeed;

    // Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.sprite.fireRate = weapon.fireRate;

    // Tell the Weapon to track the 'player' ship, offset by 14px horizontally, 0 vertically
    weapon.sprite.trackSprite(ship.sprite, 43, 9);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        fire: game.input.keyboard.addKey(Phaser.Keyboard.K),
    };
    this.fireButton = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
};

Level01.prototype.update = function() {
    this.gameConfig.game.physics.arcade.collide(this.ship.sprite, this.stone);

    var cursors = this.cursors;
    var wasd = this.wasd;

    if (cursors.left.isDown || wasd.left.isDown) {
        this.ship.sprite.body.velocity.x -= this.ship.acceleration;
    } else if (cursors.right.isDown || wasd.right.isDown) {
        this.ship.sprite.body.velocity.x += this.ship.acceleration;
    }

    if (cursors.up.isDown || wasd.up.isDown) {
        this.ship.sprite.body.velocity.y -= this.ship.acceleration;
    } else if (cursors.down.isDown || wasd.down.isDown) {
        this.ship.sprite.body.velocity.y += this.ship.acceleration;
    }

    if (this.fireButton.isDown || wasd.fire.isDown) {
        this.ship.weapon.sprite.fire();
    }
}

Level01.prototype.timer = function() {
    var ship = this.ship;

    if (ship.sprite.body.velocity.x < 10 && ship.sprite.body.velocity.x > -10) {
        ship.sprite.body.velocity.x = 0;
    } else if (ship.sprite.body.velocity.x < 0) {
        ship.sprite.body.velocity.x += ship.dragForce;
    } else if (ship.sprite.body.velocity.x > 0) {
        ship.sprite.body.velocity.x -= ship.dragForce;
    }

    if (ship.sprite.body.velocity.y < 10 && ship.sprite.body.velocity.y > -10) {
        ship.sprite.body.velocity.y = 0;
    } else if (ship.sprite.body.velocity.y < 0) {
        ship.sprite.body.velocity.y += ship.dragForce;
    } else if (ship.sprite.body.velocity.y > 0) {
        ship.sprite.body.velocity.y -= ship.dragForce;
    }
}

Level01.prototype.render = function() {
    this.ship.weapon.sprite.debug();    
}

Level01.prototype.configureShip = function() {
    var weapon = {
        spriteName: 'bullet',
        maxBullets: 40,
        bulletAngleOffset: 90,
        bulletSpeed: 1000,
        fireRate: 100,
        fireAngle: Phaser.ANGLE_RIGHT,
        sprite: undefined
    }

    this.ship = {
        spriteName: 'ship',
        acceleration: 100,
        dragForce: 50,
        maxSpeed: 1000,
        mass: 100,
        width: 50,
        height: 0,
        sprite: undefined,
        weapon: weapon
    }
}

Level01.prototype.configureLevel = function() {
    this.map = {
        stones: {
            count: 10,
            lesser: {mass: 50, size: 10},
            greatter: {mass: 200, size: 150}
        }
    }
}

