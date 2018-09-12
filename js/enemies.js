var Asteroid = function(game, spriteName, mapWidth, mapHeight) {
    Phaser.Sprite.call(this, game,
        game.rnd.integerInRange(mapWidth, mapWidth + 100),
        game.rnd.integerInRange(0, mapHeight),
        spriteName
    );

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.mustRestart = true;
    
    this.mass = 100;
    this.velocity = -100;

    this.initialLife = this.life = 20;
    this.name = "asteroid";
    this.visible = false;
}

var RotatorEnemy = function(game, spriteName, mapWidth, mapHeight) {
    Phaser.Sprite.call(this, game,
        game.rnd.integerInRange(mapWidth, mapWidth + 100),
        game.rnd.integerInRange(0, mapHeight),
        spriteName
    );

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.mustRestart = true;

    this.mass = 50;
    this.velocity = -150;

    this.initialLife = this.life = 10;
    this.name = "rotatorEnemy";
    this.visible = false;
}

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

RotatorEnemy.prototype = Object.create(Phaser.Sprite.prototype);
RotatorEnemy.prototype.constructor = RotatorEnemy;

// ================ COMMON FUNCTIONS ===================== //

RotatorEnemy.prototype.start = Asteroid.prototype.start = function() {
    this.visible = true;
};

RotatorEnemy.prototype.restart = Asteroid.prototype.restart = function() {
    this.life = this.initialLife;
    this.body.sprite.x = this.game.rnd.integerInRange(this.mapWidth, this.mapWidth + 400);
    this.body.sprite.y = this.game.rnd.integerInRange(0, this.mapHeight);
};

RotatorEnemy.prototype.update = Asteroid.prototype.update = function() {
    
};

RotatorEnemy.prototype.hit = Asteroid.prototype.hit = function(damage) {
    this.life -= damage;
    
    if (this.life <= 0) {
        var explosion = this.game.add.sprite(this.body.x, this.body.y, 'explosion');
        explosion.animations.add('explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        explosion.animations.play('explosion', 20, false, true);

        if (this.mustRestart) {
            this.restart();
        } else {
            this.kill();
        }
    }
};

RotatorEnemy.prototype.timer = Asteroid.prototype.timer = function() {
    this.body.velocity.set(this.velocity, 0);
    if (this.body.position.x < 0) {
        this.restart();
    }
};

// ================ CUSTOM FUNCTIONS ===================== //

RotatorEnemy.prototype.create = function() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
    game.add.tween(this).to( { angle: 360 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, false);
};

Asteroid.prototype.create = function() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
};

