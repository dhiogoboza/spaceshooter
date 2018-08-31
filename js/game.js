var constants = {
    FULLSCREEN: -1,
    TIMER_DELAY: 50
};

var config = {
    type: Phaser.AUTO,
    width: constants.FULLSCREEN,
    height: constants.FULLSCREEN,
    timer: timer,
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game;
var ship;
var weapon;

// controls
var cursors;
var fireButton;
var wasd;
var map;

window.onload = function() {
    var gameContainer = document.getElementById("game-content");
    var width = config.width;
    var height = config.height;

    if (width == constants.FULLSCREEN) {
        width = window.innerWidth;
    }

    if (height == constants.FULLSCREEN) {
        height = window.innerHeight;
    }

    game = new Phaser.Game(width, height, config["type"], gameContainer, config["scene"]);

    configureShip();
    configurePhase();
};

function configureShip() {
    weapon = {
        spriteName: 'bullet',
        maxBullets: 40,
        bulletAngleOffset: 90,
        bulletSpeed: 1000,
        fireRate: 100,
        fireAngle: Phaser.ANGLE_RIGHT,
        sprite: undefined
    }

    ship = {
        spriteName: 'ship',
        acceleration: 50,
        dragForce: 20,
        maxSpeed: 500,
        mass: 100,
        width: 50,
        height: 0,
        sprite: undefined,
        weapon: weapon
    }
}

function configurePhase() {
    map = {
        stones: {
            count: 10,
            lesser: {mass: 50, size: 10},
            greatter: {mass: 200, size: 150}
        }
    }
}

function preload() {
    game.load.image('bullet', '/assets/sprites/bullet.png');
    game.load.image('ship', '/assets/sprites/shmup-ship2.png');
    game.load.image('stone01', '/assets/particlestorm/particles/barkshard.png');
}

var stone;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create ship
    ship.sprite = this.add.sprite(320, 500, ship.spriteName, 2);
    
    stone = this.add.sprite(380, 500, "stone01", 3);
    
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

    cursors = this.input.keyboard.createCursorKeys();
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        fire: game.input.keyboard.addKey(Phaser.Keyboard.K),
    };
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // Add desacelaration timer
    game.time.events.loop(constants.TIMER_DELAY, config["timer"], this);
    
    
    emitter = game.add.emitter(game.world.centerX, game.world.centerY, 200, 200);

    //  Here we're passing an array of image keys. It will pick one at random when emitting a new particle.
    emitter.makeParticles(['ship', 'bullet'], 200, true, true);
    //emitter.minParticleSpeed.setTo(-200, -300);
    //emitter.maxParticleSpeed.setTo(200, -400);
    //emitter.gravity = 150;
    //emitter.bounce.setTo(0.5, 0.5);
    //emitter.angularDrag = 30;
    
    emitter.start(false, 5000, 20);
    
    
}

function update() {
    //game.physics.arcade.collide(emitter);
    game.physics.arcade.collide(ship.sprite, stone);

    if (cursors.left.isDown || wasd.left.isDown) {
        ship.sprite.body.velocity.x -= ship.acceleration;
    } else if (cursors.right.isDown || wasd.right.isDown) {
        ship.sprite.body.velocity.x += ship.acceleration;
    }

    if (cursors.up.isDown || wasd.up.isDown) {
        ship.sprite.body.velocity.y -= ship.acceleration;
    } else if (cursors.down.isDown || wasd.down.isDown) {
        ship.sprite.body.velocity.y += ship.acceleration;
    }

    if (fireButton.isDown || wasd.fire.isDown) {
        weapon.sprite.fire();
    }
}

function timer() {
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

function render() {
    weapon.sprite.debug();
}
