var PowerUp = function(game, spriteName, mapWidth, mapHeight) {
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

    this.name = "power_up";
    this.visible = false;
}

PowerUp.prototype = Object.create(Phaser.Sprite.prototype);
PowerUp.prototype.constructor = PowerUp;

PowerUp.prototype.start = function() {
    this.visible = true;
};

PowerUp.prototype.create = function() {
    this.enableBody = true;
    this.physicsBodyType = Phaser.Physics.ARCADE;
    this.body.immovable = false;
    this.body.mass = this.mass;
    this.body.velocity.x = this.velocity;
};

PowerUp.prototype.restart = function() {
    this.life = this.initialLife;
    this.body.sprite.x = this.game.rnd.integerInRange(this.mapWidth, this.mapWidth + 400);
    this.body.sprite.y = this.game.rnd.integerInRange(0, this.mapHeight);
};

PowerUp.prototype.update = function() {
    
};

PowerUp.prototype.hit = function(damage) {
    if (damage < 0) {
        this.life = 0;
    } else {
        this.life -= damage;
    }

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

PowerUp.prototype.timer = function() {
    this.body.velocity.set(this.velocity, 0);
    if (this.body.position.x < 0) {
        this.restart();
    }
};

