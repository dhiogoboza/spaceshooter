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
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};


var sprite;
var weapon;
var cursors;
var fireButton;
var game;

window.onload = function() {
    var gameContainer = document.getElementById("game-content");
    //game = new Phaser.Game(config);
    game = new Phaser.Game(config["width"], config["height"], config["type"], gameContainer, config["scene"]);
};

function preload() {
    game.load.image('bullet', '/assets/sprites/bullet.png');
    game.load.image('ship', '/assets/sprites/shmup-ship.png');
}

function create() {
    //  Creates 30 bullets, using the 'bullet' graphic
    weapon = game.add.weapon(30, 'bullet');

    //  The bullet will be automatically killed when it leaves the world bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;

    //  Because our bullet is drawn facing up, we need to offset its rotation:
    weapon.bulletAngleOffset = 90;

    //  The speed at which the bullet is fired
    weapon.bulletSpeed = 400;

    //  Speed-up the rate of fire, allowing them to shoot 1 bullet every 60ms
    weapon.fireRate = 60;

    sprite = this.add.sprite(320, 500, 'ship');

    game.physics.arcade.enable(sprite);

    //  Tell the Weapon to track the 'player' Sprite, offset by 14px horizontally, 0 vertically
    weapon.trackSprite(sprite, 14, 0);

    cursors = this.input.keyboard.createCursorKeys();

    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

}

function update() {
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
    }

    if (fireButton.isDown)
    {
        weapon.fire();
    }

}

function render() {
    weapon.debug();
}
