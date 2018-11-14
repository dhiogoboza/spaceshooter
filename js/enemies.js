var Asteroid = function(game, spriteName, mapWidth, mapHeight, onFinish) {
    Phaser.Sprite.call(this, game,
        game.rnd.integerInRange(mapWidth, mapWidth + 100),
        game.rnd.integerInRange(0, mapHeight),
        spriteName
    );

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.mustRestart = false;
    
    this.mass = 100;
    this.velocity = -100;

    this.initialLife = this.life = 20;
    this.name = "asteroid";
    this.visible = false;
    this.onFinish = onFinish;
}

var RotatorEnemy = function(game, spriteName, mapWidth, mapHeight, onFinish) {
    Phaser.Sprite.call(this, game,
        game.rnd.integerInRange(mapWidth + 100, mapWidth + 200),
        game.rnd.integerInRange(0, mapHeight),
        spriteName
    );

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.mustRestart = false;

    this.mass = 50;
    this.velocity = -150;

    this.initialLife = this.life = 10;
    this.name = "rotatorEnemy";
    this.visible = false;
    this.onFinish = onFinish;
}

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

RotatorEnemy.prototype = Object.create(Phaser.Sprite.prototype);
RotatorEnemy.prototype.constructor = RotatorEnemy;

// ================ COMMON FUNCTIONS ===================== //

RotatorEnemy.prototype.start = function() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
    this.anchor.set(0.5, 0.5);
    game.add.tween(this).to( { angle: 360 }, 6000, Phaser.Easing.Linear.None, true, 0, 1000, false);
    this.visible = true;
}

Asteroid.prototype.start = function() {
    this.visible = true;
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
};

RotatorEnemy.prototype.restart = Asteroid.prototype.restart = function() {
    this.life = this.initialLife;
    this.body.sprite.x = this.game.rnd.integerInRange(this.mapWidth, this.mapWidth + 400);
    this.body.sprite.y = this.game.rnd.integerInRange(0, this.mapHeight);
};

RotatorEnemy.prototype.update = Asteroid.prototype.update = function() {
    
};

RotatorEnemy.prototype.hit = Asteroid.prototype.hit = function(damage) {
    if (damage < 0) {
        this.life = 0;
    } else {
        this.life -= damage;
    }

    if (this.life <= 0) {
        var explosion = this.game.add.sprite(this.body.x, this.body.y, 'explosion');
        explosion.animations.add('explosion', [0, 1, 2, 3, 4, 5, 6]);
        explosion.animations.play('explosion', 10, false, true);

        if (this.mustRestart) {
            this.restart();
        } else {
            this.onFinish();
        }
    }
};

RotatorEnemy.prototype.timer = Asteroid.prototype.timer = function() {
    //this.body.velocity.set(this.velocity, 0);
    if (this.body.position.x < 0) {
        if (this.mustRestart) {
            this.restart();
        } else {
            this.onFinish();
        }
    }
};

