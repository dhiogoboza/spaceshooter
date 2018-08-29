var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    timer: timer,
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};


var ship;
var weapon;
var cursors;
var fireButton;
var game;

window.onload = function() {
    var gameContainer = document.getElementById("game-content");
    //game = new Phaser.Game(config);
    game = new Phaser.Game(config["width"], config["height"], config["type"], gameContainer, config["scene"]);
    
    ship = {
        acceleration: 40,
        drag_force: 20,
        mass: 100,
        width: 200,
        height: 0,
        sprite: undefined
    }

};

function preload() {
    game.load.image('bullet', '/assets/sprites/bullet.png');
    game.load.image('ship', '/assets/sprites/shmup-ship2.png');
}

function create() {
    // create ship
    ship.sprite = this.add.sprite(320, 500, 'ship');
    var scale = ship.width / ship.sprite.width;
    ship.height = scale * ship.sprite.height;
    ship.sprite.scale.setTo(scale);
    
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');
    
    weapon.fireAngle = Phaser.ANGLE_RIGHT;

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 60;

    game.physics.arcade.enable(ship.sprite);
    //sprite.body.drag.set(70);
    ship.sprite.body.maxVelocity.set(200);
    ship.sprite.body.mass = ship.mass;

    //  Tell the Weapon to track the 'player' ship, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(ship.sprite, 43, 9);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

    // add desacelaration timer
    game.time.events.repeat(50, Phaser.Timer.SECOND * 1, config["timer"], this);
}

function update() {
    //ship.sprite.body.velocity.x = 0;
    //ship.sprite.body.velocity.y = 0;

    if (cursors.left.isDown) {
        ship.sprite.body.velocity.x -= ship.acceleration;
    } else if (cursors.right.isDown) {
        ship.sprite.body.velocity.x += ship.acceleration;
    }

    if (cursors.up.isDown) {
        ship.sprite.body.velocity.y -= ship.acceleration;
    } else if (cursors.down.isDown) {
        ship.sprite.body.velocity.y += ship.acceleration;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

}

function timer() {
    console.log("timer");
    if (ship.sprite.body.velocity.x < 0) {
        ship.sprite.body.velocity.x += ship.drag_force;
    } else if (ship.sprite.body.velocity.x > 0) {
        ship.sprite.body.velocity.x -= ship.drag_force;
    }

    if (ship.sprite.body.velocity.y < 0) {
        ship.sprite.body.velocity.y += ship.drag_force;
    } else if (ship.sprite.body.velocity.y > 0) {
        ship.sprite.body.velocity.y -= ship.drag_force;
    }
}

function render() {
    weapon.debug();
}
